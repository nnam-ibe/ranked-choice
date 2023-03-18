import { NextApiRequest, NextApiResponse } from 'next';

import { PollService } from '../../../../lib/data/Poll';
import type { Vote, ApiSuccess } from '../../../../lib/schemas';
import { withMiddleware } from '../../../../lib/api/middlewares';

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
