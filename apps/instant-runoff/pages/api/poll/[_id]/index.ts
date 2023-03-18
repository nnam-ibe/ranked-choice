import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../../lib/data/Poll';
import { withMiddleware } from '../../../../lib/api/middlewares';
import type { Poll } from '../../../../lib/schemas';

async function getPoll(req: NextApiRequest, res: NextApiResponse<Poll>) {
  const poll = await PollService.getPoll(req.query._id as string);
  res.status(200).json(poll);
}

export default withMiddleware(getPoll);
