import mongoose from 'mongoose';
import { ApiError } from 'next/dist/server/api-utils';

import { PollModel } from '../schemas';
import { dbConnect } from '../../config/connection';
import type { PollCreation, PollWithResult, Vote } from '../schemas';

const { ObjectId } = mongoose.Types;

export const PollService = {
  closePoll: async (pollIdString: string) => {
    await dbConnect();
    const pollId = new ObjectId(pollIdString);
    const result = await PollModel.updateOne({ _id: pollId }, { closed: true });
    if (!result.acknowledged) {
      throw new ApiError(403, 'Failed to close poll');
    }
    return result;
  },
  createPoll: async (poll: PollCreation) => {
    await dbConnect();
    const doc = new PollModel(poll);
    await doc.save();
  },
  submitVote: async (vote: Vote) => {
    const { _id: pollIdString, choice } = vote;
    await dbConnect();
    const pollId = new ObjectId(pollIdString);
    const poll = await PollModel.findOne(pollId);
    if (!poll) throw new ApiError(403, 'Poll not found');
    if (poll.closed) throw new ApiError(403, 'Poll already closed');

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
  getResult: async (pollIdString: string) => {
    await dbConnect();
    const pollId = new ObjectId(pollIdString);

    const poll = await PollModel.aggregate([
      { $match: { _id: pollId } },
      {
        $addFields: {
          totalVotes: { $sum: '$choices.votes' },
        },
      },
    ]);
    if (!poll[0]) throw new ApiError(403, 'Poll not found');

    return poll[0] as PollWithResult;
  },
};
