import { NextApiRequest, NextApiResponse } from 'next';
import { PollAPIZodSchema } from '@ranked-choice-voting/types';
import type {
  APIPoll,
  ApiSuccess,
  PollCreation,
} from '@ranked-choice-voting/types';

import { PollService } from '../../../core/api/PollService';
import { withMiddleware } from '../../../core/api/middlewares';

function getPollFromAPI(poll: APIPoll): PollCreation {
  const choices = poll.choices.map((title) => ({
    title,
    votes: 0,
  })) as PollCreation['choices'];

  return {
    ...poll,
    choices,
  };
}

async function createPoll(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess>
) {
  const poll = PollAPIZodSchema.parse(req.body);

  await PollService.createPoll(getPollFromAPI(poll));
  res.status(200).json({ message: 'success' });
}

export default withMiddleware(createPoll);
