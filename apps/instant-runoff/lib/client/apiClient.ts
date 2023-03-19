import { PollAPI } from '../schemas';

export async function fetchPoll(pollId: string) {
  // TODO: baseUrl should be moved to config file
  return fetch(`http://localhost:4200/api/poll/${pollId}`).then((res) =>
    res.json()
  );
}

export async function submitVote(pollId: string, choice: string) {
  // TODO: baseUrl should be moved to config file
  return fetch(`http://localhost:4200/api/poll/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ choice }),
  }).then((res) => res.json());
}

export async function createPoll(poll: PollAPI) {
  // TODO: baseUrl should be moved to config file
  return fetch(`http://localhost:4200/api/poll/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(poll),
  }).then((res) => res.json());
}
