import { fireEvent, render } from '@testing-library/react';

import { FormInput } from './form-input';

describe('FormInput Component', () => {
  it('renders the label and input', () => {
    const value = 'Three';
    const onChange = jest.fn();
    const placeholder = 'Enter a number';
    const helperText = 'Sample helper text';
    const errorMessage = 'Sample error message';
    const label = 'Sample Field Label';

    const { getByText, queryByText, getByDisplayValue } = render(
      <FormInput
        id="sample-input"
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        helperText={helperText}
        errorMessage={errorMessage}
      />
    );
    expect(getByText(label)).toBeTruthy();
    expect(getByText(helperText)).toBeTruthy();
    expect(getByDisplayValue(value)).toBeTruthy();

    expect(queryByText(placeholder)).toBeNull();
    expect(queryByText(errorMessage)).toBeNull();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders error message when isInvalid is true', () => {
    const value = 'Three';
    const onChange = jest.fn();
    const placeholder = 'Enter a number';
    const helperText = 'Sample helper text';
    const errorMessage = 'Sample error message';
    const label = 'Sample Field Label';
    const isInvalid = true;

    const { getByText, queryByText, getByDisplayValue } = render(
      <FormInput
        id="sample-input"
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        helperText={helperText}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    );
    expect(getByText(label)).toBeTruthy();
    expect(getByText(errorMessage)).toBeTruthy();
    expect(getByDisplayValue(value)).toBeTruthy();

    expect(queryByText(placeholder)).toBeNull();
    expect(queryByText(helperText)).toBeNull();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls the onChange callback when value is updated', () => {
    const onChange = jest.fn();
    const placeholder = 'Enter a number';
    const helperText = 'Sample helper text';
    const errorMessage = 'Sample error message';
    const label = 'Sample Field Label';
    const isInvalid = true;

    const { getByText, queryByText, getByLabelText } = render(
      <FormInput
        id="sample-input"
        label={label}
        onChange={onChange}
        placeholder={placeholder}
        helperText={helperText}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    );
    const input = getByLabelText(label);
    fireEvent.change(input, { target: { value: 'Bring' } });

    expect(getByText(label)).toBeTruthy();
    expect(getByText(errorMessage)).toBeTruthy();

    expect(queryByText(placeholder)).toBeNull();
    expect(queryByText(helperText)).toBeNull();

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders right addon', () => {
    const onChange = jest.fn();
    const placeholder = 'Enter a number';
    const helperText = 'Sample helper text';
    const errorMessage = 'Sample error message';
    const label = 'Sample Field Label';
    const isInvalid = true;
    const rightAddon = { title: 'right Button', onClick: jest.fn() };

    const { getByText, queryByText, getByRole } = render(
      <FormInput
        id="sample-input"
        label={label}
        onChange={onChange}
        placeholder={placeholder}
        helperText={helperText}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        rightAddon={rightAddon}
      />
    );
    expect(getByText(label)).toBeTruthy();
    expect(getByText(errorMessage)).toBeTruthy();
    expect(getByText(rightAddon.title)).toBeTruthy();

    const button = getByRole('button', { name: rightAddon.title });

    fireEvent.click(button);
    expect(rightAddon.onClick).toHaveBeenCalledTimes(1);
  });
});
