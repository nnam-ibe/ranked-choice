import { APIPoll } from '../../core/schemas/PollSchemas';
import type { Vote } from '../../core/schemas/VoteSchema';

// TODO: use useQuery to fetch data

export async function fetchPoll(pollId: string) {
  // TODO: baseUrl should be moved to config file
  return fetch(`/api/poll/${pollId}`).then((res) => res.json());
}

export async function submitVote(pollId: string, data: Vote) {
  // TODO: baseUrl should be moved to config file
  return fetch(`/api/poll/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function createPoll(poll: APIPoll) {
  // TODO: baseUrl should be moved to config file
  return fetch(`/api/poll/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(poll),
  }).then((res) => res.json());
}
