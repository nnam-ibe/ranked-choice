import { Types } from 'mongoose';
import { z } from 'zod';

import { VotingSystem } from '@ranked-choice-voting/constants';

const irvVoteZodSchema = z.object({
  _id: z.string() || z.instanceof(Types.ObjectId),
  rankingMap: z.record(z.number(), z.string()),
  pollId: z.string() || z.instanceof(Types.ObjectId),
  VotingSystem: z.literal(VotingSystem.IRV).optional(),
});

export const irvVoteCreationZodSchema = irvVoteZodSchema
  .omit({
    _id: true,
  })
  .extend({
    rankingMap: z.record(z.coerce.number(), z.string()),
    pollId: z.string().optional() || z.instanceof(Types.ObjectId).optional(),
  });

const fppVoteZodSchema = z.object({
  _id: z.string(),
  choice: z.string(),
  VotingSystem: z.literal(VotingSystem.FPP).optional(),
});

export type FPPVote = z.infer<typeof fppVoteZodSchema>;
export type IRVVote = z.infer<typeof irvVoteZodSchema>;
export type IRVVoteCreation = z.infer<typeof irvVoteCreationZodSchema>;
export type Vote = IRVVoteCreation | FPPVote;

export const isIRVVote = (vote: Vote): vote is IRVVoteCreation =>
  'rankingMap' in vote && 'pollId' in vote;
