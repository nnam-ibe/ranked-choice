import { NextApiRequest, NextApiResponse } from 'next';
import { PollQueryTransformZodSchema } from '@ranked-choice-voting/types';
import type { PollsList } from '@ranked-choice-voting/types';

import { PollService } from '../../../core/api/PollService';
import { withMiddleware } from '../../../core/api/middlewares';

async function getPolls(req: NextApiRequest, res: NextApiResponse<PollsList>) {
  const query = PollQueryTransformZodSchema.parse(req.query);
  const polls = await PollService.getPolls({ query });
  res.status(200).json(polls);
}

export default withMiddleware(getPolls);
