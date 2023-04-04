import { render } from '@testing-library/react';

import AppLink from './app-link';

describe('AppLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppLink href="#">Link</AppLink>);
    expect(baseElement).toBeTruthy();
  });
});
