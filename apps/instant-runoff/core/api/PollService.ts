import mongoose from 'mongoose';
import { ApiError } from 'next/dist/server/api-utils';

import { PollModel } from '../schemas/PollSchemas';
import {
  IRVVoteModel,
  isIRVVote,
  Vote,
  VotingSystems,
} from '../schemas/VoteSchema';
import type {
  Poll,
  PollCreation,
  PollsList,
  PollWithResult,
} from '../schemas/PollSchemas';
import type { IRVVote } from '../schemas/VoteSchema';

const { ObjectId } = mongoose.Types;

type QueryOptions = {
  query?: mongoose.FilterQuery<unknown>;
  limit?: number;
  sort?: { [key: string]: -1 | 1 };
};

export const PollService = {
  activatePoll: async (pollIdString: string) => {
    const pollId = new ObjectId(pollIdString);
    const result = await PollModel.updateOne({ _id: pollId }, { active: true });
    if (!result.acknowledged) {
      throw new ApiError(403, 'Failed to activate poll');
    }
    return result;
  },
  calculateResult: async (pollIdString: string) => {
    const pollId = new ObjectId(pollIdString);
    const poll = await PollModel.findOne<Poll>({ _id: pollId });
    if (poll?.type !== VotingSystems.IRV) {
      throw new ApiError(403, 'Can only calculate result for IRV polls');
    }
    const votes = await IRVVoteModel.find<IRVVote>({ pollId });
    return compileRankedVoting(poll, votes);
  },
  closePoll: async (pollIdString: string) => {
    const pollId = new ObjectId(pollIdString);
    const result = await PollModel.updateOne({ _id: pollId }, { closed: true });
    if (!result.acknowledged) {
      throw new ApiError(403, 'Failed to close poll');
    }
    return result;
  },
  createPoll: async (poll: PollCreation) => {
    const doc = new PollModel(poll);
    await doc.save();
  },
  deactivePoll: async (pollIdString: string) => {
    const pollId = new ObjectId(pollIdString);
    const result = await PollModel.updateOne(
      { _id: pollId },
      { active: false }
    );
    if (!result.acknowledged) {
      throw new ApiError(403, 'Failed to deactivate poll');
    }
    return result;
  },
  getPoll: async (pollIdString: string) => {
    const pollId = new ObjectId(pollIdString);

    const poll = await PollModel.findOne<Poll>({ _id: pollId });
    if (!poll) throw new ApiError(403, 'Poll not found');

    return poll;
  },
  getPolls: async (options?: QueryOptions): Promise<PollsList> => {
    const limit = options?.limit ?? 10;
    const sort = options?.sort ?? { _id: -1 };
    const query = options?.query ?? {};
    if (!query.active) query.active = true;
    const polls = await PollModel.find<Poll>(query, {
      _id: 1,
      title: 1,
      closed: 1,
      description: 1,
    })
      .sort(sort)
      .limit(limit);
    return polls;
  },
  getResult: async (pollIdString: string) => {
    const pollId = new ObjectId(pollIdString);

    const polls = await PollModel.aggregate<PollWithResult>([
      { $match: { _id: pollId } },
      {
        $addFields: {
          totalVotes: { $sum: '$choices.votes' },
        },
      },
    ]);
    if (!polls[0]) throw new ApiError(403, 'Poll not found');
    const [poll] = polls;
    if (poll.type === VotingSystems.IRV) {
      const irvVotes = await IRVVoteModel.find<IRVVote>({ pollId });
      const compiledVotes = compileRankedVoting(poll, irvVotes);
      poll.compiledVotes = compiledVotes;
    }

    return poll;
  },
  submitVote: async (vote: Vote) => {
    if (!isIRVVote(vote)) {
      const { _id: pollIdString, choice } = vote;
      const pollId = new ObjectId(pollIdString);
      const poll = await PollModel.findOne(pollId);
      if (!poll) throw new ApiError(403, 'Poll not found');
      if (poll.closed) throw new ApiError(403, 'Poll already closed');
      if (!poll.active) throw new ApiError(403, 'Poll has been deactivated');

      const pollOption = poll.choices.find((c) => c.title === choice);
      if (!pollOption) {
        throw new ApiError(403, 'Poll option not found');
      }
      const result = await PollModel.updateOne(
        {
          _id: pollId,
          'choices._id': pollOption._id,
        },
        {
          $inc: {
            'choices.$.votes': 1,
          },
        }
      );
      if (!result.acknowledged) {
        throw new ApiError(403, 'SVote not submitted');
      }
      return result;
    }

    const rankings = Object.keys(vote.rankingMap) as unknown as Array<
      keyof typeof vote.rankingMap
    >;
    const accumulator = {} as Record<string, number>;
    const voteMap = rankings.reduce((acc, rank) => {
      const title = vote.rankingMap[rank];
      acc[title] = rank;
      return acc;
    }, accumulator);
    vote.voteMap = voteMap;
    const doc = new IRVVoteModel(vote);
    await doc.save();
  },
};

function getTopVote(vote: IRVVote, numOfChoices: number) {
  for (let i = 1; i <= numOfChoices; i++) {
    if (vote.rankingMap[i] !== undefined) {
      return vote.rankingMap[i];
    }
  }
  throw new ApiError(403, 'There is no top vote');
}

export function compileRankedVoting(
  poll: Poll,
  votes: IRVVote[],
  compiledVotes?: Poll['compiledVotes']
): Poll['compiledVotes'] {
  if (!compiledVotes) {
    compiledVotes = {
      stages: [],
    };
  }

  const { choices } = poll;

  const numberOfVotes = votes.length;
  const threshold = Math.floor(numberOfVotes / 2) + 1;
  const voteCounts = new Map<string, number>(choices.map((c) => [c.title, 0]));
  const topVoteMap = new Map<string, string>();

  votes.forEach((vote) => {
    const topVote = getTopVote(vote, choices.length);
    topVoteMap.set(vote._id, topVote);
    const currentCount = voteCounts.get(topVote) ?? 0;
    voteCounts.set(topVote, currentCount + 1);
  });

  // Save the current stage
  const voteStage: Record<string, number> = {};
  for (const [title, votes] of voteCounts.entries()) {
    voteStage[title] = votes;
  }
  compiledVotes.stages.push(voteStage);

  const winner = choices.find((choice) => {
    const votesRecieved = voteCounts.get(choice.title);
    if (votesRecieved === undefined) return false;
    return votesRecieved >= threshold;
  });

  if (winner) {
    compiledVotes.winner = winner;
    return compiledVotes;
  }

  // Elimate the lowest ranked choice
  let lowestChoice = choices[0];
  choices.forEach((choice) => {
    const lowestChoiceVotes = voteCounts.get(lowestChoice.title) ?? 0;
    const currentChoiceVotes = voteCounts.get(choice.title) ?? 0;
    if (currentChoiceVotes < lowestChoiceVotes) {
      lowestChoice = choice;
    }
  });

  // Redistribute votes from lowest ranked choice
  const newVotes: IRVVote[] = votes.map((v) => {
    const vTopVote = topVoteMap.get(v._id);
    if (vTopVote !== lowestChoice.title) return v;

    const rank = v.voteMap[lowestChoice.title];

    delete v.rankingMap[rank];
    delete v.voteMap[lowestChoice.title];

    return v;
  });

  return compileRankedVoting(poll, newVotes, compiledVotes);
}
