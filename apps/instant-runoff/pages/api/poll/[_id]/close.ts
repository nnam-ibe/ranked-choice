import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../../lib/data/Poll';
import type { ApiSuccess } from '../../../../lib/schemas';
import { withMiddleware } from '../../../../lib/api/middlewares';

async function closePoll(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess>
) {
  const pollIdString = req.query._id as string;
  await PollService.closePoll(pollIdString);
  res.status(200).json({ message: 'success' });
}

export default withMiddleware(closePoll);
