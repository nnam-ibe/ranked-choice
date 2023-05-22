import { Types } from 'mongoose';
import { z } from 'zod';
import {
  choiceMaxLength,
  choicesMinLength,
  pollDescriptionMaxLength,
  pollTitleMaxLength,
  VotingSystem,
  VotingSystems,
} from '@ranked-choice-voting/constants';

const compiledVotes = z
  .object({
    winner: z
      .object({
        _id: z.string() || z.instanceof(Types.ObjectId),
        title: z
          .string()
          .min(1)
          .max(
            choiceMaxLength,
            `Must be at most ${choiceMaxLength} characters`
          ),
        votes: z.number(),
      })
      .optional(),
    stages: z.record(z.number()).array(),
    eliminated: z.string().array().array(),
    numberOfVotes: z.number().optional(),
    threshold: z.number().optional(),
  })
  .optional();

export const PollZodSchema = z.object({
  _id: z.string() || z.instanceof(Types.ObjectId),
  description: z
    .string()
    .max(
      pollDescriptionMaxLength,
      `Must be at most ${pollDescriptionMaxLength} characters`
    ),
  title: z
    .string()
    .min(1, 'A title is required')
    .max(
      pollTitleMaxLength,
      `Must be at most ${pollTitleMaxLength} characters`
    ),
  choices: z
    .object({
      _id: z.string() || z.instanceof(Types.ObjectId),
      title: z
        .string()
        .min(1)
        .max(choiceMaxLength, `Must be at most ${choiceMaxLength} characters`),
      votes: z.number(),
    })
    .array()
    .min(
      choicesMinLength,
      `You must have at least ${choicesMinLength} choices`
    ),
  closed: z.boolean(),
  active: z.boolean(),
  type: z.enum(VotingSystems),
  compiledVotes,
});

const PollZodCreationSchema = PollZodSchema.omit({
  _id: true,
  closed: true,
  active: true,
});

export const PollAPIZodSchema = PollZodCreationSchema.extend({
  choices: z
    .string()
    .min(1)
    .max(choiceMaxLength, `Must be at most ${choiceMaxLength} characters`)
    .array()
    .min(
      choicesMinLength,
      `You must have at least ${choicesMinLength} choices`
    ),
});

export const PollFormZodSchema = PollAPIZodSchema.extend({
  type: z.boolean(),
}).transform<APIPoll>((val) => {
  if (val.type === true) return { ...val, type: VotingSystem.IRV };
  return { ...val, type: VotingSystem.FPP };
});

export const PollsListZodSchema = PollZodSchema.pick({
  closed: true,
  description: true,
  _id: true,
  title: true,
}).array();

const PollWithResultSchema = PollZodSchema.extend({
  totalVotes: z.number(),
  compiledVotes,
});

export const PollQueryZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(VotingSystems).optional(),
  closed: z.string().optional(),
});

export const PollQueryTransformZodSchema = PollQueryZodSchema.transform(
  (val) => {
    if (!val.closed) return val;

    if (val.closed === 'true') return { ...val, closed: true };
    return { ...val, closed: false };
  }
);

export type Poll = z.infer<typeof PollZodSchema>;
export type PollCreation = z.infer<typeof PollZodCreationSchema>;
export type APIPoll = z.infer<typeof PollAPIZodSchema>;
export type PollsList = z.infer<typeof PollsListZodSchema>;
export type PollWithResult = z.infer<typeof PollWithResultSchema>;
export type PollQuery = z.infer<typeof PollQueryZodSchema>;
export type PollQueryTransformed = z.infer<typeof PollQueryTransformZodSchema>;
export type PollForm = z.infer<typeof PollFormZodSchema>;
