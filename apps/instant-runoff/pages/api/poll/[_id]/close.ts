import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../../core/api/PollService';
import { withMiddleware } from '../../../../core/api/middlewares';
import type { ApiSuccess } from '../../../../core/schemas/ApiSchemas';

async function closePoll(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess>
) {
  const pollIdString = req.query._id as string;
  await PollService.closePoll(pollIdString);
  res.status(200).json({ message: 'success' });
}

export default withMiddleware(closePoll);
