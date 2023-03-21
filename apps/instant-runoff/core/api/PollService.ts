import mongoose from 'mongoose';
import { ApiError } from 'next/dist/server/api-utils';

import { PollModel } from '../schemas/PollSchemas';
import type {
  Poll,
  PollCreation,
  PollsList,
  PollWithResult,
  Vote,
} from '../schemas/PollSchemas';

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

    const poll = await PollModel.aggregate<PollWithResult>([
      { $match: { _id: pollId } },
      {
        $addFields: {
          totalVotes: { $sum: '$choices.votes' },
        },
      },
    ]);
    if (!poll[0]) throw new ApiError(403, 'Poll not found');

    return poll[0];
  },
  submitVote: async (vote: Vote) => {
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
      throw new ApiError(403, 'Vote not submitted');
    }
    return result;
  },
};
