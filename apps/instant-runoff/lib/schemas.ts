import mongoose from 'mongoose';
import { z } from 'zod';

const { ObjectId } = mongoose.Types;

const PollOptionSchema = new mongoose.Schema({
  title: String,
  votes: Number,
});

export const PollSchema = new mongoose.Schema<Poll>({
  title: String,
  description: String,
  choices: [PollOptionSchema],
  closed: { type: Boolean, default: false },
});

export const PollModel =
  (mongoose.models.Poll as mongoose.Model<Poll>) ||
  mongoose.model('Poll', PollSchema);

export const PollZodSchema = z.object({
  _id: z.string() || z.instanceof(ObjectId),
  description: z.string(),
  title: z.string(),
  choices: z
    .object({
      _id: z.string() || z.instanceof(ObjectId),
      title: z.string(),
      votes: z.number(),
    })
    .array()
    .nonempty(),
  closed: z.boolean(),
});

export const PollCreationSchema = PollZodSchema.omit({
  _id: true,
  closed: true,
});

export const PollAPIZodSchema = PollCreationSchema.extend({
  choices: z.string().array().nonempty(),
});

export const PollWithResultSchema = PollZodSchema.extend({
  totalVotes: z.number(),
});

export type Poll = z.infer<typeof PollZodSchema>;
export type PollCreation = z.infer<typeof PollCreationSchema>;
export type PollAPI = z.infer<typeof PollAPIZodSchema>;

export const voteZodSchema = z.object({
  _id: z.string(),
  choice: z.string(),
});

export const ApiSuccessSchema = z.object({
  message: z.literal('success'),
});

export type Vote = z.infer<typeof voteZodSchema>;
export type PollWithResult = z.infer<typeof PollWithResultSchema>;
export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
