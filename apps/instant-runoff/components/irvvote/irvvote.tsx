import React from 'react';
import { FormControl, FormLabel, Select, Tag } from '@chakra-ui/react';
import type { Poll } from '@ranked-choice-voting/types';

import { range } from '../../core/utils/range';
import { toOrdinalNumber } from '../../core/utils/numberFormatter';
import styles from './irvvote.module.css';

import utilStyles from '../../styles/utils.module.css';

type IRVVoteProps = {
  poll: Poll;
  rankChoice: Record<number, string>;
  choiceRank: Record<string, number>;
  onChange: (nextValue: string, rank: number) => void;
};

export function IRVVote(props: IRVVoteProps) {
  const { choiceRank, onChange, poll, rankChoice } = props;

  return (
    <div className={styles.container}>
      <div className={utilStyles.tagContainer}>
        {poll.choices.map((item) => (
          <Tag
            key={item._id}
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            variant="solid"
          >
            {item.title}
          </Tag>
        ))}
      </div>
      <div className={styles['poll-options']}>
        {range(poll.choices.length).map((i) => {
          const rank = i + 1;
          const rankText = toOrdinalNumber(rank);
          const labelClassName = i === 0 ? 'required-field' : '';
          return (
            <FormControl key={poll.choices[i]._id}>
              <FormLabel className={labelClassName}>
                {rankText} Choice
              </FormLabel>
              <Select
                placeholder="Select an option"
                data-rank={rank}
                value={rankChoice[rank]}
                onChange={(e) => {
                  const selectedOption = e.target.value;
                  onChange(selectedOption, rank);
                }}
              >
                {range(poll.choices.length).reduce((acc, j) => {
                  if (
                    choiceRank[poll.choices[j].title] !== rank &&
                    choiceRank[poll.choices[j].title] > -1
                  )
                    return acc;

                  acc.push(
                    <option
                      value={poll.choices[j].title}
                      key={poll.choices[j]._id}
                    >
                      {poll.choices[j].title}
                    </option>
                  );

                  return acc;
                }, [] as React.ReactNode[])}
              </Select>
            </FormControl>
          );
        })}
      </div>
    </div>
  );
}

export default IRVVote;
