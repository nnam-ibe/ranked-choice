import { useReducer } from 'react';
import { Alert, AlertIcon, Button, Text, VStack } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import { VotingSystem } from '@ranked-choice-voting/constants';
import type { Poll, Vote } from '@ranked-choice-voting/types';

import { AppLink } from '../../../components/app-link/app-link';
import { FPPVote } from '../../../components/fppvote/fppvote';
import { getErrorMessage } from '../../../core/utils/error';
import { IRVVote } from '../../../components/irvvote/irvvote';
import { PollService } from '../../../core/api/PollService';
import { range } from '../../../core/utils/range';
import { stringifyData } from '../../../core/utils/stringify';
import { submitVote } from '../../../lib/client/apiClient';
import mongoClient from '../../../lib/mongodb';
import styles from './index.module.css';

type PollProps = {
  poll: Poll;
};

type PollPageState = {
  alertMessage: string;
  alertStatus: 'success' | 'error' | 'info' | 'warning';
  choiceRank: Record<string, number>;
  rankChoice: Record<number, string>;
  selectedOption: string;
  showAlert: boolean;
  submitDisabled: boolean;
  submitLoading: boolean;
  voted: boolean;
};

type PollPageAction =
  | { type: 'updateIrvChoice'; newChoice: string; rank: number }
  | {
      type: 'submit' | 'closeAlert';
    }
  | { type: 'selectOption'; option: string }
  | { type: 'submitFailure'; alertMessage: string }
  | { type: 'submitSuccess'; alertMessage: string };

function getInitialChoiceRank(poll: Poll) {
  return poll.choices.reduce((acc, curr) => {
    acc[curr.title] = -1;
    return acc;
  }, {} as Record<string, number>);
}

function getInitialRankChoice(poll: Poll) {
  return range(1, poll.choices.length + 1).reduce((acc, value) => {
    acc[value] = '';
    return acc;
  }, {} as Record<number, string>);
}

function getIRVUpdate(state: PollPageState, newChoice: string, rank: number) {
  const { choiceRank, rankChoice } = state;

  const update = { choiceRank, rankChoice };
  const prevChoice = rankChoice[rank];

  update.rankChoice[rank] = newChoice;
  update.choiceRank[newChoice] = rank;
  if (prevChoice) {
    update.choiceRank[prevChoice] = -1;
  }
  return update;
}

const pollPageReducer = (
  state: PollPageState,
  action: PollPageAction
): PollPageState => {
  switch (action.type) {
    case 'closeAlert':
      return { ...state, showAlert: false };
    case 'selectOption':
      return { ...state, selectedOption: action.option };
    case 'submit':
      return {
        ...state,
        submitDisabled: true,
        submitLoading: true,
        showAlert: false,
      };
    case 'submitSuccess':
      return {
        ...state,
        submitDisabled: false,
        submitLoading: false,
        showAlert: true,
        alertMessage: action.alertMessage,
        alertStatus: 'success',
        voted: true,
      };
    case 'submitFailure':
      return {
        ...state,
        submitDisabled: false,
        submitLoading: false,
        showAlert: true,
        alertMessage: action.alertMessage,
        alertStatus: 'error',
      };

    case 'updateIrvChoice':
      return {
        ...state,
        ...getIRVUpdate(state, action.newChoice, action.rank),
      };
    default:
      throw new Error('invalid action');
  }
};

export function Poll(props: PollProps) {
  const { poll } = props;
  const [state, dispatch] = useReducer(pollPageReducer, {
    alertMessage: 'Poll is closed.',
    alertStatus: 'success',
    choiceRank: getInitialChoiceRank(poll),
    rankChoice: getInitialRankChoice(poll),
    selectedOption: '',
    showAlert: poll.closed || false,
    submitDisabled: false,
    submitLoading: false,
    voted: false,
  });

  const handleOptionChange = (nextValue: string) => {
    dispatch({ type: 'selectOption', option: nextValue });
  };

  const handleSubmit = async () => {
    dispatch({ type: 'submit' });
    try {
      let data: Vote;
      if (poll.type === VotingSystem.IRV) {
        data = {
          VotingSystem: poll.type,
          pollId: poll._id,
          rankingMap: state.rankChoice,
        };
      } else {
        data = {
          _id: poll._id,
          choice: state.selectedOption,
          VotingSystem: poll.type,
        };
      }

      await submitVote(poll._id as string, data);
      dispatch({ type: 'submitSuccess', alertMessage: 'Vote submitted!' });
    } catch (error) {
      dispatch({ type: 'submitFailure', alertMessage: getErrorMessage(error) });
    }
    setTimeout(() => {
      dispatch({ type: 'closeAlert' });
    }, 7000);
  };

  const voteSection =
    poll.type === 'FPP' ? (
      <FPPVote
        poll={poll}
        value={state.selectedOption}
        onChange={handleOptionChange}
      />
    ) : (
      <IRVVote
        poll={poll}
        rankChoice={state.rankChoice}
        choiceRank={state.choiceRank}
        onChange={(newChoice: string, rank: number) =>
          dispatch({ type: 'updateIrvChoice', newChoice, rank })
        }
      />
    );

  return (
    <article className={styles['container']}>
      <Text fontSize="2xl">{poll.title}</Text>
      <Text fontSize="xl">{poll.description}</Text>
      <VStack spacing={2}>
        {state.showAlert && (
          <Alert status={state.alertStatus} className="alert-container">
            {state.alertStatus === 'error' && <AlertIcon />}
            {state.alertMessage}
          </Alert>
        )}
        {voteSection}
        <Button
          colorScheme={'blue'}
          onClick={handleSubmit}
          isDisabled={poll.closed || state.voted || state.submitDisabled}
          isLoading={state.submitLoading}
          size="lg"
          width={'100%'}
        >
          {state.voted ? 'Voted!' : 'Submit Vote!'}
        </Button>
        {(poll.closed || state.voted) && (
          <div className={styles.viewResults}>
            <AppLink href={`/poll/${poll._id}/result`}>View Results →</AppLink>
          </div>
        )}
      </VStack>
    </article>
  );
}

type ServerSideParams = { id: string };
type ServerSideResult = GetServerSideProps<PollProps, ServerSideParams>;

export const getServerSideProps: ServerSideResult = async ({ params }) => {
  await mongoClient;
  const poll = await PollService.getPoll(params?.id ?? '');

  return {
    props: {
      poll: stringifyData(poll),
    },
  };
};

export default Poll;
