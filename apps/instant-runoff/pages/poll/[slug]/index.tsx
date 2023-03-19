import { useReducer } from 'react';
import { Alert, Button, Radio, RadioGroup, Sheet, Stack } from '@mui/joy';
import Link from 'next/link';

import { PollService } from '../../../lib/data/Poll';
import { submitVote } from '../../../lib/client/apiClient';
import styles from './index.module.css';
import type { Poll } from '../../../lib/schemas';

export interface PollProps {
  poll: Poll;
}

type PollPageState = {
  alertColor: 'primary' | 'danger' | 'neutral';
  alertMessage: string;
  selectedOption: string;
  showAlert: boolean;
  submitDisabled: boolean;
  submitLoading: boolean;
  voted: boolean;
};

type PollPageAction =
  | {
      type: 'submit' | 'closeAlert';
    }
  | { type: 'selectOption'; option: string }
  | { type: 'submitFailure'; alertMessage: string }
  | { type: 'submitSuccess'; alertMessage: string };

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
        voted: true,
      };
    case 'submitSuccess':
      return {
        ...state,
        submitDisabled: false,
        submitLoading: false,
        showAlert: true,
        alertColor: 'primary',
        alertMessage: action.alertMessage,
      };
    case 'submitFailure':
      return {
        ...state,
        submitDisabled: false,
        submitLoading: false,
        showAlert: true,
        alertColor: 'danger',
        alertMessage: action.alertMessage,
      };
    default:
      throw new Error('invalid action');
  }
};

export function Poll(props: PollProps) {
  const { poll } = props;
  const [state, dispatch] = useReducer(pollPageReducer, {
    alertColor: 'neutral',
    alertMessage: 'Poll is closed.',
    selectedOption: '',
    showAlert: poll.closed || false,
    submitDisabled: false,
    submitLoading: false,
    voted: false,
  });

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'selectOption', option: event.target.value });
  };

  const handleSubmit = async () => {
    dispatch({ type: 'submit' });
    try {
      await submitVote(poll._id as string, state.selectedOption);
      dispatch({ type: 'submitSuccess', alertMessage: 'Vote submitted!' });
    } catch (error) {
      dispatch({ type: 'submitFailure', alertMessage: error.message });
    }
    setTimeout(() => {
      dispatch({ type: 'closeAlert' });
    }, 3000);
  };

  return (
    <article className={styles['container']}>
      <h1 className={styles.h1}>{poll.title}</h1>
      <div className={styles.prompt}>{poll.description}</div>
      <Stack spacing={2}>
        {state.showAlert && (
          <Alert className={styles['alert']} color={state.alertColor}>
            {state.alertMessage}
          </Alert>
        )}
        <RadioGroup
          size="lg"
          sx={{ gap: 1.5 }}
          value={state.selectedOption}
          onChange={handleOptionChange}
        >
          {poll.choices.map(({ title }) => (
            <Sheet key={title}>
              <Radio
                label={title}
                overlay
                disableIcon
                value={title}
                slotProps={{
                  label: ({ checked }) => ({
                    sx: {
                      fontWeight: 'lg',
                      fontSize: 'md',
                      color: checked ? 'text.primary' : 'text.secondary',
                      padding: '1rem 1rem',
                      minWidth: '20vw',
                    },
                  }),
                  action: ({ checked }) => ({
                    sx: (theme) => ({
                      ...(checked && {
                        '--variant-borderWidth': '2px',
                        '&&': {
                          // && to increase the specificity to win the base :hover styles
                          borderColor: theme.vars.palette.primary[500],
                        },
                      }),
                    }),
                  }),
                }}
              />
            </Sheet>
          ))}
        </RadioGroup>
        <Button
          title="Submit Vote!"
          onClick={handleSubmit}
          disabled={poll.closed || state.voted || state.submitDisabled}
          loading={state.submitLoading}
          size="lg"
        >
          {state.voted ? 'Voted!' : 'Submit Vote!'}
        </Button>
        {poll.closed && (
          <div className={styles.viewResults}>
            <Link href={`/poll/${poll._id}/result`}>View Results →</Link>
          </div>
        )}
      </Stack>
    </article>
  );
}

export async function getServerSideProps({ params }) {
  const poll = await PollService.getPoll(params.slug);

  return {
    props: {
      poll: JSON.parse(JSON.stringify(poll)),
    },
  };
}

export default Poll;
