import {
  Alert,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';

import { PollService } from '../../../core/api/PollService';
import { stringifyData } from '../../../core/utils/stringify';
import mongoClient from '../../../lib/mongodb';
import styles from './result.module.css';
import type { PollWithResult } from '../../../core/schemas/PollSchemas';

export interface ResultProps {
  poll: Partial<PollWithResult>;
}

/**
- TODO: Click to expand for ItemContent lines that run too long
 */

export function ResultPage(props: ResultProps) {
  const { poll } = props;

  if (!poll.closed) {
    return (
      <article className={styles['container']}>
        <Text fontSize="2xl">{poll.title} Results</Text>
        <Text fontSize="xl">{poll.description}</Text>
        <VStack>
          <Alert status="info">{'Poll is still open'}</Alert>
          <div className={styles.viewResults}>
            <Link href={`/poll/${poll._id}`}>← Back to Poll</Link>
          </div>
        </VStack>
      </article>
    );
  }

  const sortedChoices = poll.choices?.sort((a, b) => b.votes - a.votes);

  return (
    <article className={styles['container']}>
      <Text fontSize="2xl">{poll.title} Results</Text>
      <Text fontSize="xl">{poll.description}</Text>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Poll Results</TableCaption>
          <Thead>
            <Tr>
              <Th>Option</Th>
              <Th isNumeric>Votes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedChoices?.map((option) => {
              return (
                <Tr key={option._id}>
                  <Td>{option.title}</Td>
                  <Td isNumeric>{option.votes}</Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Total Votes</Th>
              <Th isNumeric>{poll.totalVotes}</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </article>
  );
}

type ServerSideParams = { slug: string };
type ServerSideResult = GetServerSideProps<ResultProps, ServerSideParams>;

export const getServerSideProps: ServerSideResult = async ({ params }) => {
  await mongoClient;
  const poll = await PollService.getResult(params?.slug ?? '');

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
