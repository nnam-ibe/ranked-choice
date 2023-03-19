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

import styles from './result.module.css';
import type { Poll } from '../../../lib/schemas';
import { PollService } from '../../../lib/data/Poll';

export interface ResultProps {
  poll: Poll;
}

export function ResultPage(props: ResultProps) {
  const { poll } = props;

  if (!poll.closed) {
    return (
      <article className={styles['container']}>
        <h1 className={styles.h1}>{poll.title} Results</h1>
        <div className={styles.prompt}>{poll.description}</div>
        <Box sx={{ py: 2, pr: 2, width: 320 }}>
          <Alert className={styles['alert']} color="info">
            {'Poll is still open'}
          </Alert>
          <div className={styles.viewResults}>
            <Link href={`/poll/${poll._id}`}>← Back to Polls</Link>
          </div>
        </Box>
      </article>
    );
  }

  const sortedChoices = poll.choices.sort((a, b) => b.votes - a.votes);

  return (
    <article className={styles['container']}>
      <h1 className={styles.h1}>{poll.title} Results</h1>
      <div className={styles.prompt}>{poll.description}</div>
      <Box sx={{ py: 2, pr: 2, width: 320 }}>
        <List aria-label="Results">
          {sortedChoices.map((option, index) => {
            return (
              <>
                <ListDivider />
                <ListItem key={option._id as string}>
                  <ListItemContent>{option.title}</ListItemContent>
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

export async function getServerSideProps({ params }) {
  const poll = await PollService.getPoll(params.slug);

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
      poll: JSON.parse(JSON.stringify(result)),
    },
  };
}

export default ResultPage;
