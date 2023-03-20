import mongoose from 'mongoose';
import { z } from 'zod';

const { ObjectId } = mongoose.Types;

export const choiceMaxLength = 32;
export const choicesMinLength = 2;
export const choicesMaxLength = 20;

const pollTitleMaxLength = 64;
const pollDescriptionMaxLength = 128;

const PollOptionSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: choiceMaxLength,
    minLength: 1,
  },
  votes: Number,
});

const PollSchema = new mongoose.Schema<Poll>({
  title: {
    type: String,
    maxLength: pollTitleMaxLength,
    minLength: 1,
  },
  description: {
    type: String,
    maxLength: pollDescriptionMaxLength,
    minLength: 1,
  },
  choices: [PollOptionSchema],
  closed: { type: Boolean, default: false },
});

export const PollModel =
  (mongoose.models?.Poll as mongoose.Model<Poll>) ||
  mongoose.model('Poll', PollSchema);

// ZOD SCHEMAS

export const PollZodSchema = z.object({
  _id: z.string() || z.instanceof(ObjectId),
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
      _id: z.string() || z.instanceof(ObjectId),
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
});

const PollZodCreationSchema = PollZodSchema.omit({
  _id: true,
  closed: true,
});

export const APIPollZodSchema = PollZodCreationSchema.extend({
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

export const PollsListZodSchema = PollZodSchema.pick({
  closed: true,
  description: true,
  _id: true,
  title: true,
}).array();

const PollWithResultSchema = PollZodSchema.extend({
  totalVotes: z.number(),
});

export type Poll = z.infer<typeof PollZodSchema>;
export type PollCreation = z.infer<typeof PollZodCreationSchema>;
export type APIPoll = z.infer<typeof APIPollZodSchema>;
export type PollsList = z.infer<typeof PollsListZodSchema>;
export type PollWithResult = z.infer<typeof PollWithResultSchema>;

export const voteZodSchema = z.object({
  _id: z.string(),
  choice: z.string(),
});

export type Vote = z.infer<typeof voteZodSchema>;
