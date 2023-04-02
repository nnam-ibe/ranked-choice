import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { VotingSystem } from '@ranked-choice-voting/constants';
import { irvVoteCreationZodSchema } from '@ranked-choice-voting/types';
import type { ApiSuccess, Vote } from '@ranked-choice-voting/types';

import { PollService } from '../../../../core/api/PollService';
import { withMiddleware } from '../../../../core/api/middlewares';

async function submitVote(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess>
) {
  if (!req.body.VotingSystem) {
    throw new ApiError(400, 'VotingSystem is required');
  }

  let vote: Vote;
  if (req.body.VotingSystem === VotingSystem.IRV) {
    vote = irvVoteCreationZodSchema.parse({
      ...req.body,
      pollId: req.query._id,
    });
    if (!vote.rankingMap[1]) {
      throw new ApiError(400, 'Top ranked candidate is required');
    }
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
