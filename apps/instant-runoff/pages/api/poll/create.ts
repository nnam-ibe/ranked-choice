import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../lib/data/Poll';
import { PollAPIZodSchema } from '../../../lib/schemas';
import type { ApiSuccess, PollAPI, PollCreation } from '../../../lib/schemas';
import { withMiddleware } from '../../../lib/api/middlewares';

function getPollFromAPI(poll: PollAPI): PollCreation {
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
