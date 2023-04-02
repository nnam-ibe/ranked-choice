import type { Poll, IRVVote } from '@ranked-choice-voting/types';

type CompileVotesFunction = (
  poll: Poll,
  votes: IRVVote[],
  options?: {
    compiledVotes?: Poll['compiledVotes'];
    choicesLeft?: Poll['choices'];
  }
) => Poll['compiledVotes'];

export function getHighestRankedVote(
  vote: IRVVote,
  numOfChoices: number,
  allowedChoices: string[]
) {
  for (let i = 1; i <= numOfChoices; i++) {
    if (
      vote.rankingMap[i] !== undefined &&
      allowedChoices.includes(vote.rankingMap[i])
    ) {
      return vote.rankingMap[i];
    }
  }
}

export const compileRankedVotes: CompileVotesFunction = (
  poll,
  votes,
  options = {}
) => {
  const numberOfVotes = votes.length;
  const threshold = Math.floor(numberOfVotes / 2) + 1;

  const compiledVotes = options.compiledVotes ?? {
    stages: [],
    eliminated: [],
    numberOfVotes: numberOfVotes,
    threshold: threshold,
  };
  const choicesLeft = options.choicesLeft ?? [...poll.choices];

  const votesReceivedCounts = new Map<string, number>(
    choicesLeft.map((c) => [c.title, 0])
  );
  const firstChoiceMap = new Map<string, string>();

  votes.forEach((vote) => {
    const topVote = getHighestRankedVote(
      vote,
      poll.choices.length,
      choicesLeft.map((c) => c.title)
    );
    if (!topVote) return;
    firstChoiceMap.set(vote._id, topVote);
    const currentCount = votesReceivedCounts.get(topVote) ?? 0;
    votesReceivedCounts.set(topVote, currentCount + 1);
  });

  // Save the current stage
  const voteStage: Record<string, number> = {};
  poll.choices.forEach((choice) => {
    voteStage[choice.title] = votesReceivedCounts.get(choice.title) ?? 0;
  });
  compiledVotes.stages.push(voteStage);

  const winner = choicesLeft.find((choice) => {
    const votesReceived = votesReceivedCounts.get(choice.title);
    if (votesReceived === undefined) return false;
    return votesReceived >= threshold;
  });

  if (winner) {
    winner.votes = votesReceivedCounts.get(winner.title) ?? 0;
    compiledVotes.winner = winner;
    return compiledVotes;
  }

  // sort choices by votes received
  choicesLeft.sort((a, b) => {
    const aVotes = votesReceivedCounts.get(a.title) ?? 0;
    const bVotes = votesReceivedCounts.get(b.title) ?? 0;
    return bVotes - aVotes;
  });

  // if the first and last choice in sorted choices have the same number of votes,
  // then they all have the same number of votes and there is no winner
  const firstChoiceVotes = votesReceivedCounts.get(choicesLeft[0].title) ?? 0;
  const lastChoiceVotes =
    votesReceivedCounts.get(choicesLeft[choicesLeft.length - 1].title) ?? 0;
  if (firstChoiceVotes === lastChoiceVotes) {
    return compiledVotes;
  }

  // Eliminate the lowest ranked choice and redistribute votes
  const lowestRankedChoice = choicesLeft[choicesLeft.length - 1];
  const choicesWithLowestVotes = choicesLeft.filter((choice) => {
    const votesReceived = votesReceivedCounts.get(choice.title);
    if (!votesReceived) return true;
    return votesReceived === lastChoiceVotes;
  });
  const lowestRankedTitles = choicesWithLowestVotes.map((c) => c.title);
  const prevEliminated =
    compiledVotes.eliminated.length > 0
      ? [...compiledVotes.eliminated[compiledVotes.eliminated.length - 1]]
      : [];
  compiledVotes.eliminated.push([...prevEliminated, ...lowestRankedTitles]);

  const newVotes: IRVVote[] = votes.map((v) => {
    const highestRankedChoice = firstChoiceMap.get(v._id);
    if (
      !highestRankedChoice ||
      !lowestRankedTitles.includes(highestRankedChoice)
    )
      return v;

    // remove the lowest ranked choice from the ranking map
    const ranksLeft = Object.keys(v.rankingMap) as unknown as number[];
    const vRank = ranksLeft.find(
      (rank) => v.rankingMap[rank] === lowestRankedChoice.title
    );

    if (vRank) {
      delete v.rankingMap[vRank];
    }

    return v;
  });
  const nextChoices = choicesLeft.filter((choice) => {
    return !lowestRankedTitles.includes(choice.title);
  });

  return compileRankedVotes(poll, newVotes, {
    compiledVotes,
    choicesLeft: nextChoices,
  });
};
