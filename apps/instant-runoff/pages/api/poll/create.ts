import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../core/api/PollService';
import { APIPollZodSchema } from '../../../core/schemas/PollSchemas';
import { withMiddleware } from '../../../core/api/middlewares';
import type { APIPoll, PollCreation } from '../../../core/schemas/PollSchemas';
import type { ApiSuccess } from '../../../core/schemas/ApiSchemas';

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
  const poll = APIPollZodSchema.parse(req.body);

  await PollService.createPoll(getPollFromAPI(poll));
  res.status(200).json({ message: 'success' });
}

export default withMiddleware(createPoll);
