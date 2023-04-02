import { VotingSystem } from '@ranked-choice-voting/constants';

export const favoriteHouseVotes = [
  {
    _id: '64288906fb0f2e59d9be5ce7',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Slytherin',
      '2': 'Hufflepuff',
      '3': 'Ravenclaw',
      '4': 'Gryffindor',
    },
  },
  {
    _id: '642888fafb0f2e59d9be5ce0',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Gryffindor',
      '2': 'Ravenclaw',
      '3': 'Slytherin',
      '4': 'Hufflepuff',
    },
  },
  {
    _id: '642888f0fb0f2e59d9be5cd9',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Gryffindor',
      '2': 'Hufflepuff',
      '3': 'Slytherin',
      '4': 'Ravenclaw',
    },
  },
  {
    _id: '642888dffb0f2e59d9be5cd0',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Hufflepuff',
      '2': 'Ravenclaw',
      '3': 'Gryffindor',
      '4': 'Slytherin',
    },
  },
];

export const firstChoiceNoWinner = [
  {
    _id: '64288906fb0f2e59d9be5ce7',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Slytherin',
    },
  },
  {
    _id: '642888fafb0f2e59d9be5ce0',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Gryffindor',
    },
  },
  {
    _id: '642888f0fb0f2e59d9be5cd9',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Gryffindor',
    },
  },
  {
    _id: '642888dffb0f2e59d9be5cd0',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Hufflepuff',
    },
  },
  {
    _id: '642888dffb0f2e59d9be5cd0',
    pollId: '642888cbfb0f2e59d9be5cc3',
    rankingMap: {
      '1': 'Ravenclaw',
    },
  },
];

export const sampleChoices = [
  {
    _id: '44d8d7cb-573c-4d78-b8b6-20089881d2b7',
    title: 'Bob',
    votes: 0,
  },
  {
    _id: '44d8d7cb-573c-4d78-b8b6-20089881d2b7',
    title: 'Sue',
    votes: 0,
  },
  {
    _id: 'fc4c7b2d-455c-4f4e-b07e-138355da4b85',
    title: 'Bill',
    votes: 0,
  },
];
export const sampleVotes = [
  {
    _id: '4e72926b-9ceb-4fa2-ba6b-8b79420c0bad',
    rankingMap: {
      1: 'Bob',
      3: 'Sue',
      2: 'Bill',
    },
    pollId: 'poll_id',
    VotingSystem: VotingSystem.IRV,
  },
  {
    _id: '8d9871a6-b48a-43ad-9de8-d81fed86ad58',
    rankingMap: {
      2: 'Bob',
      1: 'Sue',
      3: 'Bill',
    },
    pollId: 'poll_id',
    VotingSystem: VotingSystem.IRV,
  },
  {
    _id: 'e82f73a5-f9e4-4271-bf8d-d45afccdc885',
    rankingMap: {
      3: 'Bob',
      2: 'Sue',
      1: 'Bill',
    },
    pollId: 'poll_id',
    VotingSystem: VotingSystem.IRV,
  },
  {
    _id: '8eb1de6a-f04a-4f96-87ef-398ad6d3ad3b',
    rankingMap: {
      1: 'Bob',
      3: 'Sue',
      2: 'Bill',
    },
    pollId: 'poll_id',
    VotingSystem: VotingSystem.IRV,
  },
  {
    _id: '359044b6-7902-42ff-a1fd-a298f06fa303',
    rankingMap: {
      2: 'Bob',
      1: 'Sue',
      3: 'Bill',
    },
    pollId: 'poll_id',
    VotingSystem: VotingSystem.IRV,
  },
];
