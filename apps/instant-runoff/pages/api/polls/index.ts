import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../core/api/PollService';
import { withMiddleware } from '../../../core/api/middlewares';
import type { PollsList } from '../../../core/schemas/PollSchemas';

async function getPolls(req: NextApiRequest, res: NextApiResponse<PollsList>) {
  const polls = await PollService.getPolls();
  res.status(200).json(polls);
}

export default withMiddleware(getPolls);
