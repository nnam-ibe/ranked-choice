import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Button } from './button';

describe('Button Component', () => {
  it('renders button', () => {
    const onClick = jest.fn();
    const title = 'Press Me';

    const { getByText } = render(
      <Button id="sample-button" onClick={onClick}>
        {title}
      </Button>
    );
    expect(getByText(title)).toBeTruthy();

    fireEvent.click(getByText(title));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when isDisabled is true', () => {
    const onClick = jest.fn();
    const title = 'Press Me';

    const { getByRole } = render(
      <Button id="sample-button" onClick={onClick} isDisabled={true}>
        {title}
      </Button>
    );
    const button = getByRole('button', { name: title });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(button).toBeDisabled();
  });

  it('should prevent clicks when isLoading is true', () => {
    const onClick = jest.fn();
    const title = 'Press Me';

    const { getByRole } = render(
      <Button id="sample-button" onClick={onClick} isLoading={true}>
        {title}
      </Button>
    );
    const button = getByRole('button', { name: title });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(button).toBeDisabled();
  });
});
