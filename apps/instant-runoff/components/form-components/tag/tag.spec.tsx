import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Tag } from './tag';

describe('Tag Component', () => {
  it('renders the label and button', () => {
    const title = 'Three';
    const onDelete = jest.fn();

    const { getByText, getByRole } = render(
      <Tag title={title} onDelete={onDelete} />
    );

    expect(getByText(title)).toBeTruthy();

    const button = getByRole('button');
    expect(button).toBeTruthy();

    fireEvent.click(button);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('renders the label without button', () => {
    const title = 'Three';

    const { getByText, queryByRole } = render(<Tag title={title} />);

    expect(getByText(title)).toBeTruthy();

    const button = queryByRole('button');
    expect(button).toBeNull();
  });
});
