import mongoose from 'mongoose';
import { IRVVote } from '@ranked-choice-voting/types';

const irvVoteSchema = new mongoose.Schema<IRVVote>({
  voteMap: 'object',
  pollId: 'objectId',
  rankingMap: 'object',
});

export const IRVVoteModel =
  (mongoose.models?.IRVVote as mongoose.Model<IRVVote>) ||
  mongoose.model('IRVVote', irvVoteSchema);
