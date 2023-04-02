import { NextApiRequest, NextApiResponse } from 'next';
import type { ApiSuccess } from '@ranked-choice-voting/types';

import { PollService } from '../../../../core/api/PollService';
import { withMiddleware } from '../../../../core/api/middlewares';

async function closePoll(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess>
) {
  const pollIdString = req.query._id as string;
  await PollService.closePoll(pollIdString);
  res.status(200).json({ message: 'success' });
}

export default withMiddleware(closePoll);
