import { render } from '@testing-library/react';
import { voteFaker } from '@ranked-choice-voting/fake-data';

import IRVVote from './irvvote';

describe('IRVVote', () => {
  it('should render successfully', () => {
    const poll = voteFaker.poll();
    const { baseElement } = render(
      <IRVVote poll={poll} onChange={jest.fn} rankChoice={{}} choiceRank={{}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
