import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../../core/api/PollService';
import type { ApiSuccess } from '../../../../core/schemas/ApiSchemas';
import type { Vote } from '../../../../core/schemas/PollSchemas';
import { withMiddleware } from '../../../../core/api/middlewares';

async function submitVote(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess>
) {
  const vote: Vote = {
    _id: req.query._id as string,
    choice: req.body.choice as string,
  };
  await PollService.submitVote(vote);
  res.status(200).json({ message: 'success' });
}

export default withMiddleware(submitVote);
