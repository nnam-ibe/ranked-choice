import mongoose from 'mongoose';
import { Poll } from '@ranked-choice-voting/types';
import {
  choiceMaxLength,
  pollDescriptionMaxLength,
  pollTitleMaxLength,
  VotingSystem,
  VotingSystems,
} from '@ranked-choice-voting/constants';

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
  },
  choices: [PollOptionSchema],
  closed: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  type: { type: 'String', enum: VotingSystems, default: VotingSystem.IRV },
  compiledVotes: {
    winner: PollOptionSchema,
    stages: [],
    numberOfVotes: Number,
    threshold: Number,
  },
});

export const PollModel =
  (mongoose.models?.Poll as mongoose.Model<Poll>) ||
  mongoose.model('Poll', PollSchema);
