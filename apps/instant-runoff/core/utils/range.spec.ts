import { range } from './range';

describe('range', () => {
  it('should return an array of numbers', () => {
    const result = range(1, 5);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should return an array of numbers with a step', () => {
    const result = range(1, 10, 2);
    expect(result).toEqual([1, 3, 5, 7, 9]);
  });

  it("should use 0 as a start if it's not provided", () => {
    const result = range(5);
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });
});
