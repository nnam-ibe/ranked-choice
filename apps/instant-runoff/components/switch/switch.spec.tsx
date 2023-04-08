import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Switch } from './switch';

describe('Switch Component', () => {
  it('renders the switch', () => {
    const onChange = jest.fn();
    const label = 'Sample Switch Label';

    const { getByText, getByRole } = render(
      <Switch id="sample-switch" label={label} onChange={onChange} />
    );
    expect(getByText(label)).toBeTruthy();
    const switchElement = getByRole('checkbox', { name: label });
    expect(switchElement).toBeTruthy();
    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(switchElement).toBeChecked();
  });
  it('allows clicking on label', () => {
    const onChange = jest.fn();
    const label = 'Sample Switch Label';

    const { getByText, getByRole } = render(
      <Switch id="sample-switch" label={label} onChange={onChange} />
    );

    const labelElement = getByText(label);
    const switchElement = getByRole('checkbox', { name: label });

    expect(labelElement).toBeTruthy();
    fireEvent.click(labelElement);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(switchElement).toBeChecked();
  });
});
