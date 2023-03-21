import {
  Alert,
  Box,
  List,
  ListItem,
  ListItemContent,
  ListDivider,
  Typography,
} from '@mui/joy';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';

import { PollService } from '../../../core/api/PollService';
import styles from './result.module.css';
import { stringifyData } from '../../../core/utils/stringify';
import type { Poll } from '../../../core/schemas/PollSchemas';

export interface ResultProps {
  poll: Poll;
}

/**
- TODO: Click to expand for ItemContent lines that run too long
 */

export function ResultPage(props: ResultProps) {
  const { poll } = props;

  if (!poll.closed) {
    return (
      <article className={styles['container']}>
        <Typography level="h2" sx={{ mb: 0.5 }}>
          {poll.title} Results
        </Typography>
        <Typography level="body1">{poll.description}</Typography>
        <Box sx={{ py: 2, pr: 2, width: 320 }}>
          <Alert className={styles['alert']} color="info">
            {'Poll is still open'}
          </Alert>
          <div className={styles.viewResults}>
            <Link href={`/poll/${poll._id}`}>← Back to Poll</Link>
          </div>
        </Box>
      </article>
    );
  }

  const sortedChoices = poll.choices.sort((a, b) => b.votes - a.votes);

  return (
    <article className={styles['container']}>
      <Typography level="h2" sx={{ mb: 0.5 }}>
        {poll.title} Results
      </Typography>
      <Typography level="body1">{poll.description}</Typography>
      <Box>
        <List aria-label="Results">
          {sortedChoices.map((option) => {
            return (
              <>
                <ListDivider />
                <ListItem key={option._id as string}>
                  <ListItemContent
                    sx={{
                      display: '-webkit-box',
                      '-webkit-line-clamp': '3',
                      '-webkit-box-orient': 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {option.title}
                  </ListItemContent>
                  <Typography
                    level="body2"
                    sx={{ fontWeight: 'bold', color: 'inherit' }}
                  >
                    {option.votes}
                  </Typography>
                </ListItem>
              </>
            );
          })}
        </List>
      </Box>
    </article>
  );
}

type ServerSideParams = { slug: string };
type ServerSideResult = GetServerSideProps<ResultProps, ServerSideParams>;

export const getServerSideProps: ServerSideResult = async ({ params }) => {
  const poll = await PollService.getPoll(params?.slug ?? '');

  const result = poll.closed
    ? poll
    : {
        _id: poll._id,
        closed: poll.closed,
        title: poll.title,
        description: poll.description,
      };

  return {
    props: {
      poll: stringifyData(result),
    },
  };
};

export default ResultPage;
