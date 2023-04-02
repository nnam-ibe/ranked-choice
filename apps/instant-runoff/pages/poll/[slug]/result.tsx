import { Text } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import type { PollWithResult } from '@ranked-choice-voting/types';

import { AppTable } from '../../../components/app-table/app-table';
import { PollService } from '../../../core/api/PollService';
import { stringifyData } from '../../../core/utils/stringify';
import mongoClient from '../../../lib/mongodb';
import styles from './result.module.css';

export type ResultProps = {
  poll: PollWithResult;
};

type Stage = NonNullable<
  ResultProps['poll']['compiledVotes']
>['stages'][number];

function getSortedStage(stage: Stage) {
  const keys = Object.keys(stage);
  const stagesAsArray = keys.map((key) => ({ title: key, votes: stage[key] }));
  return stagesAsArray?.sort((a, b) => b.votes - a.votes);
}

function FPPResult(props: { poll: ResultProps['poll'] }) {
  const { poll } = props;
  const sortedChoices = poll.choices?.sort((a, b) => b.votes - a.votes);
  if (!sortedChoices) return null;

  return (
    <div className={styles.detailsContainer}>
      <AppTable
        headers={[{ title: 'Option' }, { title: 'Votes', isNumeric: true }]}
        caption="Poll Results"
        data={sortedChoices?.map((option, index) => ({
          id: option._id,
          Option: option.title,
          Votes: option.votes,
          highlighted: index === 0,
        }))}
        footer={[
          { title: 'Total Votes' },
          { title: poll.totalVotes ?? 0, isNumeric: true },
        ]}
      />
    </div>
  );
}

function IRVResult(props: { poll: ResultProps['poll'] }) {
  const { poll } = props;
  if (!poll.compiledVotes) return null;
  const { compiledVotes } = poll;

  function isEliminated(stageNumber: number, title: string) {
    return compiledVotes.eliminated[stageNumber - 1]?.includes(title);
  }

  function isWinner(stageNumber: number, option: { title: string }) {
    return (
      compiledVotes.winner?.title === option.title &&
      stageNumber === compiledVotes.stages.length - 1
    );
  }

  return (
    <div className={styles.detailsContainer}>
      {compiledVotes.stages.map((stage, stageNumber) => {
        const sortedStage = getSortedStage(stage);
        return (
          <div key={stageNumber} className={styles.stage}>
            <AppTable
              headers={[
                { title: 'Option' },
                { title: 'Votes', isNumeric: true },
              ]}
              caption={`Stage ${stageNumber + 1} (${
                compiledVotes.threshold
              } votes needed)`}
              data={sortedStage?.map((option) => ({
                id: option.title,
                Option: option.title,
                Votes: option.votes,
                eliminated: isEliminated(stageNumber, option.title),
                highlighted: isWinner(stageNumber, option),
              }))}
              footer={[
                { title: 'Total Votes' },
                { title: compiledVotes.numberOfVotes ?? 0, isNumeric: true },
              ]}
            />
          </div>
        );
      })}
      <div className={styles.winnerContainer}>
        <Text>{'Winner: ' + <span>{compiledVotes.winner?.title}</span>}</Text>
      </div>
    </div>
  );
}

export function ResultPage(props: ResultProps) {
  const { poll } = props;

  const sortedChoices = poll.choices?.sort((a, b) => b.votes - a.votes);
  if (!sortedChoices) return null;

  return (
    <article className={styles['container']}>
      <Text fontSize="2xl" fontWeight={800}>
        {poll.title}
      </Text>
      <Text fontSize="xl==lg">{poll.description}</Text>
      {poll.type === 'IRV' ? (
        <IRVResult poll={poll} />
      ) : (
        <FPPResult poll={poll} />
      )}
    </article>
  );
}

type ServerSideParams = { slug: string };
type ServerSideResult = GetServerSideProps<ResultProps, ServerSideParams>;

export const getServerSideProps: ServerSideResult = async ({ params }) => {
  await mongoClient;
  const poll = await PollService.getResult(params?.slug ?? '');

  return {
    props: {
      poll: stringifyData(poll),
    },
  };
};

export default ResultPage;
