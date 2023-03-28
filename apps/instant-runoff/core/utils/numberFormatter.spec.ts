import { toOrdinalNumber } from './numberFormatter';
import { range } from './range';

describe('numberFormatter', () => {
  describe('toOrdinalNumber', () => {
    it('should return an array of numbers', () => {
      const test = range(21);
      const expectedResult = [
        '0th',
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th',
        '7th',
        '8th',
        '9th',
        '10th',
        '11th',
        '12th',
        '13th',
        '14th',
        '15th',
        '16th',
        '17th',
        '18th',
        '19th',
        '20th',
      ];

      test.forEach((n, i) => {
        const result = toOrdinalNumber(n);
        expect(result).toEqual(expectedResult[i]);
      });
    });
  });
});
