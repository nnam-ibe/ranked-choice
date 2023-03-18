import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../../lib/data/Poll';
import type { PollWithResult } from '../../../../lib/schemas';
import { withMiddleware } from '../../../../lib/api/middlewares';

async function getVoteResult(
  req: NextApiRequest,
  res: NextApiResponse<PollWithResult>
) {
  const pollIdString = req.query._id as string;
  const result = await PollService.getResult(pollIdString);
  res.status(200).json(result);
}

export default withMiddleware(getVoteResult);
