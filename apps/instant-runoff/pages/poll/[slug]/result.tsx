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
import { stringifyData } from '../../../core/utils/stringify';
import mongoClient from '../../../lib/mongodb';
import styles from './result.module.css';
import type { Poll } from '../../../core/schemas/PollSchemas';

export interface ResultProps {
  poll: Partial<Poll>;
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
        <Box>
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

  const sortedChoices = poll.choices?.sort((a, b) => b.votes - a.votes);

  return (
    <article className={styles['container']}>
      <Typography level="h2" sx={{ mb: 0.5 }}>
        {poll.title} Results
      </Typography>
      <Typography level="body1">{poll.description}</Typography>
      <Box>
        <List aria-label="Results">
          {sortedChoices?.map((option) => {
            return (
              <div key={option._id}>
                <ListDivider />
                <ListItem key={option._id as string}>
                  <ListItemContent
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
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
              </div>
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
  await mongoClient;
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
