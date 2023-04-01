import { NextApiRequest, NextApiResponse } from 'next';
import type { PollWithResult } from '@ranked-choice-voting/types';

import { PollService } from '../../../../core/api/PollService';
import { withMiddleware } from '../../../../core/api/middlewares';

async function getVoteResult(
  req: NextApiRequest,
  res: NextApiResponse<PollWithResult>
) {
  const pollIdString = req.query._id as string;
  const result = await PollService.getResult(pollIdString);
  res.status(200).json(result);
}

export default withMiddleware(getVoteResult);
