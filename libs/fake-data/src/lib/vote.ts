import { randNumber, randText, randUuid } from '@ngneat/falso';
import { VotingSystem } from '@ranked-choice-voting/constants';
import type { IRVVote, Poll } from '@ranked-choice-voting/types';

export const voteFaker = {
  randomizeChoices: (choices: Poll['choices']): Poll['choices'] => {
    if (choices.length === 0) return [];

    const ranksAccumulator: Record<string, number> = {};
    const randomRanks = choices.reduce((acc, choice) => {
      acc[choice.title] = Math.random();
      return acc;
    }, ranksAccumulator);

    return choices.sort((a, b) => {
      const rankA = randomRanks[a.title];
      const rankB = randomRanks[b.title];
      return rankA - rankB;
    });
  },

  rankingMap: (choices: Poll['choices']): IRVVote['rankingMap'] => {
    const rankingMap: Record<number, string> = {};
    const randomizeChoices = voteFaker.randomizeChoices(choices);

    for (let i = 1; i <= randomizeChoices.length; i++) {
      rankingMap[i] = randomizeChoices[i - 1].title;
    }
    return rankingMap;
  },

  choices: (num: number): Poll['choices'] => {
    return Array.from({ length: num }, () => ({
      _id: randUuid(),
      title: randText({ charCount: 7 }),
      votes: randNumber({ min: 1, max: 30 }),
    }));
  },

  choicesFromTitles: (titles: string[]): Poll['choices'] => {
    return titles.map((title) => ({
      _id: randUuid(),
      title,
      votes: randNumber({ min: 1, max: 30 }),
    }));
  },

  irvVotes: (choices: Poll['choices'], num: number): IRVVote[] => {
    return Array.from({ length: num }, () => ({
      _id: randUuid(),
      rankingMap: voteFaker.rankingMap(choices),
      pollId: randUuid(),
      VotingSystem: VotingSystem.IRV,
    }));
  },

  poll: (opts: Partial<Poll> = {}): Poll => {
    return {
      _id: opts._id ?? randUuid(),
      title: opts.title ?? randText({ charCount: 7 }),
      description: opts.description ?? randText({ charCount: 20 }),
      choices:
        opts.choices ?? voteFaker.choices(randNumber({ min: 4, max: 10 })),
      closed: opts.closed ?? false,
      active: opts.active ?? true,
      type: opts.type ?? VotingSystem.IRV,
    };
  },
};
