import { VotingSystem } from '@ranked-choice-voting/constants';
import { voteFaker } from './vote';

const sampleChoices = [
  { _id: 'Choice_1_id', title: 'Choice 1', votes: 15 },
  { _id: 'Choice_2_id', title: 'Choice 2', votes: 15 },
  { _id: 'Choice_3_id', title: 'Choice 3', votes: 15 },
  { _id: 'Choice_4_id', title: 'Choice 4', votes: 15 },
  { _id: 'Choice_5_id', title: 'Choice 5', votes: 15 },
];

describe('vote', () => {
  describe('randomizeChoices', () => {
    it('should return a random order of choices', () => {
      const choices = [...sampleChoices];
      const randomizedChoices = voteFaker.randomizeChoices([...choices]);

      // the order of the choices should be different
      const hasSomeChanged = randomizedChoices.some((rChoice, index) => {
        return rChoice.title !== choices[index].title;
      });
      expect(hasSomeChanged).toBe(true);

      // the number of choices should be the same
      expect(randomizedChoices.length).toBe(choices.length);

      // randomizeChoices should still contain all choices
      const hasAllChoices = randomizedChoices.every((rChoice) => {
        return choices.some((choice) => choice.title === rChoice.title);
      });
      expect(hasAllChoices).toBe(true);
    });
  });

  describe('rankingMap', () => {
    it('should return a ranking map of choices', () => {
      const choices = [...sampleChoices];
      expect(choices.length).toBe(5);

      const rankingMap = voteFaker.rankingMap([...choices]);
      const rankingMapKeys = Object.keys(rankingMap) as unknown as number[];

      // the number of choices should be the same
      expect(rankingMapKeys.length).toBe(choices.length);

      const choiceTitlesSet = new Set(choices.map((c) => c.title));
      expect(choiceTitlesSet.size).toBe(choices.length);
      rankingMapKeys.forEach((key) => {
        const keyChoice = rankingMap[key];
        expect(choiceTitlesSet.has(rankingMap[key])).toBe(true);
        choiceTitlesSet.delete(keyChoice);
      });
      expect(choiceTitlesSet.size).toBe(0);
    });
  });

  describe('choices', () => {
    it('should return a list of choices', () => {
      const choices = voteFaker.choices(5);
      expect(choices.length).toBe(5);
      choices.forEach((choice) => {
        expect(typeof choice._id).toEqual('string');
        expect(typeof choice.title).toEqual('string');
        expect(typeof choice.votes).toEqual('number');
      });
    });
  });

  describe('irvVotes', () => {
    it('should return a list of IRV votes', () => {
      const choices = [...sampleChoices];
      const votes = voteFaker.irvVotes(choices, 5);
      expect(votes.length).toBe(5);
      votes.forEach((vote) => {
        expect(typeof vote._id).toEqual('string');
        expect(typeof vote.pollId).toEqual('string');

        expect(vote.VotingSystem).toEqual(VotingSystem.IRV);

        expect(vote.rankingMap).toBeDefined();
        expect(typeof vote.rankingMap).toEqual('object');

        const rankingMapKeys = Object.keys(vote.rankingMap);
        expect(rankingMapKeys.length).toBe(choices.length);
      });
    });
  });

  describe('vote', () => {
    it('should return a vote', () => {
      const poll = voteFaker.poll();

      expect(typeof poll._id).toEqual('string');
      expect(poll.title.length).toBeGreaterThan(5);
      expect(poll.description.length).toBeGreaterThan(5);
      expect(poll.choices.length).toBeGreaterThan(3);
      expect(poll.closed).toBe(false);
      expect(poll.active).toBe(true);
      expect(poll.type).toEqual(VotingSystem.IRV);
    });

    it('should return a vote with a custom title and description', () => {
      const poll = voteFaker.poll({
        title: 'Custom Title',
        description: 'Custom Description',
      });

      expect(typeof poll._id).toEqual('string');
      expect(poll.title).toEqual('Custom Title');
      expect(poll.description).toEqual('Custom Description');
    });

    it('should return a vote with custom choices', () => {
      const choices = [
        { _id: 'Choice_1_id', title: 'Choice 1', votes: 15 },
        { _id: 'Choice_2_id', title: 'Choice 2', votes: 15 },
        { _id: 'Choice_3_id', title: 'Choice 3', votes: 15 },
      ];
      const poll = voteFaker.poll({ choices });

      expect(typeof poll._id).toEqual('string');
      expect(poll.choices).toEqual(choices);
    });
  });
});
