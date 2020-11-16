import { sum } from '../index';

describe('sum', () => {
  it('should multiply all passed parameters', () => {
    expect(sum(1, 2, 3, 4)).toBe(10);
  });
});
