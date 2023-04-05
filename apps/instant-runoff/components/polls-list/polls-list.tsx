import type { PollQuery, PollsList } from '@ranked-choice-voting/types';
import { fetchPolls } from '../../lib/client/apiClient';
import { AppLink } from '../app-link/app-link';

type PollsListProps = {
  options: Partial<PollQuery>;
};

async function getPolls(options: Partial<PollQuery>) {
  try {
    const polls = await fetchPolls(options);
    return polls;
  } catch (error) {
    console.log(error);
  }
}

export async function PollsList(props: PollsListProps) {
  const polls = await getPolls(props.options);
  if (!polls) {
    return <></>;
  }
  return (
    <>
      {polls.map((poll) => {
        return (
          <AppLink
            key={poll._id}
            href={`/poll/${poll._id}`}
            className="list-item-link"
          >
            <span>
              {poll.title}
              <span> {poll.description} </span>
            </span>
          </AppLink>
        );
      })}
    </>
  );
}
