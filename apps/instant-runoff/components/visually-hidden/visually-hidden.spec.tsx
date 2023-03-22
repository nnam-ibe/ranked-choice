import { render } from '@testing-library/react';

import VisuallyHidden from './visually-hidden';

describe('VisuallyHidden', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VisuallyHidden>Visually Hidden Text</VisuallyHidden>
    );
    expect(baseElement).toBeTruthy();
  });
});
