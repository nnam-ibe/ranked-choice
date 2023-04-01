import { NextApiRequest, NextApiResponse } from 'next';
import type { Poll } from '@ranked-choice-voting/types';

import { PollService } from '../../../../core/api/PollService';
import { withMiddleware } from '../../../../core/api/middlewares';

async function getPoll(req: NextApiRequest, res: NextApiResponse<Poll>) {
  const poll = await PollService.getPoll(req.query._id as string);
  res.status(200).json(poll);
}

export default withMiddleware(getPoll);
