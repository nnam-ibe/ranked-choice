import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../lib/data/Poll';
import { withMiddleware } from '../../../lib/api/middlewares';
import type { PollsList } from '../../../lib/schemas';

async function getPolls(req: NextApiRequest, res: NextApiResponse<PollsList>) {
  const polls = await PollService.getPolls();
  res.status(200).json(polls);
}

export default withMiddleware(getPolls);
