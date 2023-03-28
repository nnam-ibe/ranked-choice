import { render } from '@testing-library/react';

import RadioGroup from './radio-group';

describe('RadioGroup', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <RadioGroup
        options={['one', 'two', 'three']}
        onChange={jest.mock}
        value="one"
      />
    );
    expect(getByText('one')).toBeTruthy();
    expect(getByText('two')).toBeTruthy();
    expect(getByText('three')).toBeTruthy();
    expect(baseElement).toBeTruthy();
  });
});
