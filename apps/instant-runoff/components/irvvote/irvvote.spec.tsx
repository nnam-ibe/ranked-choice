import { render } from '@testing-library/react';

import IRVVote from './irvvote';

describe('IRVVote', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IRVVote />);
    expect(baseElement).toBeTruthy();
  });
});
