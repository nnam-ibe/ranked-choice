import { NextApiRequest, NextApiResponse } from 'next';

import { ApiError } from 'next/dist/server/api-utils';
import { PollService } from '../../../../core/api/PollService';
import {
  irvVoteCreationZodSchema,
  VotingSystems,
} from '../../../../core/schemas/VoteSchema';
import { withMiddleware } from '../../../../core/api/middlewares';
import type { ApiSuccess } from '../../../../core/schemas/ApiSchemas';
import type { Vote } from '../../../../core/schemas/VoteSchema';

async function submitVote(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess>
) {
  if (!req.body.VotingSystem) {
    throw new ApiError(400, 'VotingSystem is required');
  }

  let vote: Vote;
  if (req.body.VotingSystem === VotingSystems.IRV) {
    vote = irvVoteCreationZodSchema.parse({
      ...req.body,
      pollId: req.query._id,
    });
  } else {
    vote = {
      _id: req.query._id as string,
      choice: req.body.choice as string,
    };
  }

  await PollService.submitVote(vote);
  res.status(200).json({ message: 'success' });
}

export default withMiddleware(submitVote);
