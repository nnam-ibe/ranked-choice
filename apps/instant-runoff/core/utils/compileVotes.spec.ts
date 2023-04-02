import { VotingSystem } from '@ranked-choice-voting/constants';
import { voteFaker } from '@ranked-choice-voting/fake-data';

import { compileRankedVotes, getHighestRankedVote } from './compileVotes';
import {
  favoriteHouseVotes,
  firstChoiceNoWinner,
  sampleChoices,
  sampleVotes,
} from '../fixtures/votes';

describe('compileRankedVotes', () => {
  describe('getHighestRankedVote', () => {
    it('should return the top vote', () => {
      const topVote1 = getHighestRankedVote(
        {
          _id: 'a_id',
          rankingMap: {
            1: 'Bob',
            3: 'Sue',
            2: 'Bill',
          },
          pollId: 'poll_id',
          VotingSystem: VotingSystem.IRV,
        },
        3,
        ['Bob', 'Sue', 'Bill']
      );
      expect(topVote1).toEqual('Bob');

      const topVote2 = getHighestRankedVote(
        {
          _id: 'a_id',
          rankingMap: {
            3: 'Sue',
            2: 'Bill',
          },
          pollId: 'poll_id',
          VotingSystem: VotingSystem.IRV,
        },
        3,
        ['Bob', 'Sue', 'Bill']
      );
      expect(topVote2).toEqual('Bill');

      const topVote3 = getHighestRankedVote(
        {
          _id: 'a_id',
          rankingMap: {
            6: 'Sue',
            8: 'Bill',
            5: 'Bob',
          },
          pollId: 'poll_id',
          VotingSystem: VotingSystem.IRV,
        },
        7,
        ['Bob', 'Sue', 'Bill']
      );
      expect(topVote3).toEqual('Bob');
    });

    it('should return undefined if there is no ranked vote', () => {
      const topRankedVote = getHighestRankedVote(
        {
          _id: 'a_id',
          rankingMap: {
            6: 'Sue',
            8: 'Bill',
            5: 'Bob',
          },
          pollId: 'poll_id',
          VotingSystem: VotingSystem.IRV,
        },
        3,
        ['Bob', 'Sue', 'Bill']
      );
      expect(topRankedVote).toBeUndefined();
    });
  });

  describe('compileRankedVotes', () => {
    it('should compile vote stages', () => {
      const poll = voteFaker.poll({ choices: sampleChoices });
      const compiledVotes = compileRankedVotes(poll, sampleVotes);
      expect(compiledVotes?.winner).toEqual(sampleChoices[1]);

      const stages = compiledVotes?.stages;
      expect(stages?.length).toEqual(2);
      expect(stages?.[0]).toEqual({
        Bob: 2,
        Sue: 2,
        Bill: 1,
      });
      expect(stages?.[1]).toEqual({
        Bob: 2,
        Sue: 3,
        Bill: 0,
      });

      expect(compiledVotes?.eliminated).toEqual([['Bill']]);
    });

    it('should not have a winner when no candidate achieves a majority', () => {
      const candidates = ['Bob', 'Sue', 'Bill'];
      const votes = sampleVotes.slice(0, 3).map((vote, index) => {
        return {
          ...vote,
          rankingMap: {
            1: candidates[index],
          },
        };
      });
      const poll = voteFaker.poll({ choices: sampleChoices });
      const compiledVotes = compileRankedVotes(poll, votes);
      expect(compiledVotes?.winner).toBeUndefined();

      const stages = compiledVotes?.stages;
      expect(stages?.length).toEqual(1);
      expect(stages?.[0]).toEqual({
        Bob: 1,
        Sue: 1,
        Bill: 1,
      });
      expect(compiledVotes?.eliminated).toEqual([]);
    });

    it('should eliminate choices with the same amount of votes at the same stage', () => {
      const votes = favoriteHouseVotes;
      const titles = ['Slytherin', 'Hufflepuff', 'Ravenclaw', 'Gryffindor'];
      const poll = voteFaker.poll({
        choices: voteFaker.choicesFromTitles(titles),
      });

      const compiledVotes = compileRankedVotes(poll, votes);
      expect(compiledVotes?.winner).toMatchObject({
        title: 'Gryffindor',
      });

      const stages = compiledVotes?.stages;
      expect(stages?.length).toEqual(3);
      expect(stages?.[0]).toEqual({
        Gryffindor: 2,
        Hufflepuff: 1,
        Slytherin: 1,
        Ravenclaw: 0,
      });
      expect(compiledVotes?.eliminated[0]).toEqual(['Ravenclaw']);

      expect(stages?.[1]).toEqual({
        Gryffindor: 2,
        Hufflepuff: 1,
        Slytherin: 1,
        Ravenclaw: 0,
      });
      expect(compiledVotes?.eliminated[1]).toEqual(
        expect.arrayContaining(['Ravenclaw', 'Hufflepuff', 'Slytherin'])
      );

      expect(stages?.[2]).toEqual({
        Gryffindor: 4,
        Hufflepuff: 0,
        Slytherin: 0,
        Ravenclaw: 0,
      });

      expect(compiledVotes?.eliminated).toHaveLength(2);
    });

    it('should require 50+1 votes to win', () => {
      const votes = firstChoiceNoWinner;
      const titles = ['Slytherin', 'Hufflepuff', 'Ravenclaw', 'Gryffindor'];
      const poll = voteFaker.poll({
        choices: voteFaker.choicesFromTitles(titles),
      });

      const compiledVotes = compileRankedVotes(poll, votes);
      expect(compiledVotes?.winner).toBeUndefined();

      const stages = compiledVotes?.stages;
      expect(stages?.length).toEqual(2);
      expect(stages?.[0]).toEqual({
        Gryffindor: 2,
        Hufflepuff: 1,
        Slytherin: 1,
        Ravenclaw: 1,
      });
      expect(compiledVotes?.eliminated[0]).toEqual(
        expect.arrayContaining(['Hufflepuff', 'Slytherin', 'Ravenclaw'])
      );

      expect(stages?.[1]).toEqual({
        Gryffindor: 2,
        Hufflepuff: 0,
        Slytherin: 0,
        Ravenclaw: 0,
      });

      expect(compiledVotes?.eliminated).toHaveLength(1);
    });
  });
});
