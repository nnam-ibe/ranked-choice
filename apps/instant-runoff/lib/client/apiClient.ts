import type {
  APIPoll,
  Vote,
  PollQuery,
  PollsList,
} from '@ranked-choice-voting/types';

import { getBaseUrl } from '../../core/utils/path';

async function handleApiResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Error submitting vote');
  return data;
}

export async function fetchPoll(pollId: string) {
  return fetch(`/api/poll/${pollId}`).then(handleApiResponse);
}

export async function fetchPolls(
  options: Partial<PollQuery>
): Promise<PollsList> {
  return fetch(
    `${getBaseUrl()}/api/polls?${new URLSearchParams(options)}`
  ).then(handleApiResponse);
}

export async function submitVote(pollId: string, data: Vote) {
  return fetch(`/api/poll/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(handleApiResponse);
}

export async function createPoll(poll: APIPoll) {
  return fetch(`/api/poll/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(poll),
  }).then(handleApiResponse);
}
