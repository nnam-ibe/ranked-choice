import mongoose from 'mongoose';
import { z } from 'zod';

const { ObjectId } = mongoose.Types;

export const irvVoteZodSchema = z.object({
  _id: z.string() || z.instanceof(ObjectId),
  voteMap: z.record(z.string(), z.number()),
  rankingMap: z.record(z.number(), z.string()),
  pollId: z.string() || z.instanceof(ObjectId),
});

export const irvVoteCreationZodSchema = irvVoteZodSchema
  .omit({
    _id: true,
  })
  .extend({
    rankingMap: z.record(z.coerce.number(), z.string()),
    voteMap: z.record(z.string(), z.number()).optional(),
    pollId: z.string().optional() || z.instanceof(ObjectId).optional(),
  });

const fppVoteZodSchema = z.object({
  _id: z.string(),
  choice: z.string(),
});

export type FPPVote = z.infer<typeof fppVoteZodSchema>;
export type IRVVote = z.infer<typeof irvVoteZodSchema>;
export type IRVVoteCreation = z.infer<typeof irvVoteCreationZodSchema>;
export type Vote = IRVVoteCreation | FPPVote;

export const irvVoteSchema = new mongoose.Schema<IRVVote>({
  voteMap: 'object',
  pollId: 'objectId',
  rankingMap: 'object',
});

export const IRVVoteModel =
  (mongoose.models?.IRVVote as mongoose.Model<IRVVote>) ||
  mongoose.model('IRVVote', irvVoteSchema);

export const isIRVVote = (vote: Vote): vote is IRVVoteCreation =>
  'rankingMap' in vote && 'pollId' in vote;
