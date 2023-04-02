import { render } from '@testing-library/react';

import FPPVote from './fppvote';

describe('FPPVote', () => {
  it('should render successfully', () => {
    const poll = {
      _id: '1',
      title: 'test',
      description: 'test',
      choices: [
        {
          _id: '12345',
          title: 'Choice 1',
          votes: 0,
        },
        {
          _id: '54321',
          title: 'Choice 2',
          votes: 0,
        },
      ],
      closed: false,
      active: true,
      type: 'FPP',
    };
    const { baseElement } = render(
      <FPPVote value="one" poll={poll} onChange={jest.fn} />
    );
    expect(baseElement).toBeTruthy();
  });
});
