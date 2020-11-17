import {
  getRandNum,
  getRandBool,
  roundTo,
  floorTo,
  ceilTo,
  countDecimals,
  avg,
  gcd,
} from '../index';

describe('getRandNum', () => {
  beforeEach(() => {
    jest
      .spyOn(global.Math, 'random')
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should return random number in [min, max] range', () => {
    expect(getRandNum(1, 9)).toBe(5);
    expect(getRandNum(1, 9)).toBe(1);
    expect(getRandNum(1, 9)).toBe(9);
  });

  it('should return random number from 0 to passed prameter (not including) if only one was passed', () => {
    expect(getRandNum(8)).toBe(4);
    expect(getRandNum(8)).toBe(0);
    expect(getRandNum(8)).toBe(7);
  });
});

describe('getRandBool', () => {
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should return random boolean value with passed chance rate', () => {
    const rate = 0.2;
    const range = 10;
    let random = 0;
    jest.spyOn(global.Math, 'random').mockImplementation(() => random++ / range);
    const results = Array(range)
      .fill(null)
      .map(() => getRandBool(rate));
    expect(results.filter((item) => item).length).toBe(rate * range);
  });

  it('should return random boolean value with 0.5 chance rate if no parameters passed', () => {
    const rate = 0.5;
    const range = 10;
    let random = 0;
    jest.spyOn(global.Math, 'random').mockImplementation(() => random++ / range);
    const results = Array(range)
      .fill(null)
      .map(() => getRandBool());
    expect(results.filter((item) => item).length).toBe(rate * range);
  });
});

describe('roundTo', () => {
  it('should just round if no `decimals` parameter passed', () => {
    expect(roundTo(3.1410000592)).toBe(3);
  });
  it('should round to demanded amount of decimals (only if needed)', () => {
    expect(roundTo(3.1410000592, 5)).toBe(3.141);
    expect(roundTo(3.141592, 5)).toBe(3.14159);
  });
});

describe('floorTo', () => {
  it('should just floor if no `decimals` parameter passed', () => {
    expect(floorTo(3.1410000592)).toBe(3);
  });
  it('should floor to demanded amount of decimals (only if needed)', () => {
    expect(floorTo(3.1410000592, 5)).toBe(3.141);
    expect(floorTo(3.141592, 5)).toBe(3.14159);
  });
});

describe('ceilTo', () => {
  it('should just ceil if no `decimals` parameter passed', () => {
    expect(ceilTo(3.1410000592)).toBe(4);
  });
  it('should ceil to demanded amount of decimals (only if needed)', () => {
    expect(ceilTo(3.1410000592, 5)).toBe(3.14101);
    expect(ceilTo(3.141592, 5)).toBe(3.1416);
  });
});

describe('countDecimals', () => {
  it('should return amount of decimals in a number', () => {
    expect(countDecimals(1.200345)).toBe(6);
    expect(countDecimals(2)).toBe(0);
  });
});

describe('avg', () => {
  it('should return average number of all passed arguments', () => {
    expect(avg(1, 2, 3, 4)).toBe(2.5);
  });
});

describe('gcd', () => {
  it('should return gratest common divisor of two passed numbers no matter what order', () => {
    expect(gcd(9, 15)).toBe(3);
    expect(gcd(25, 10)).toBe(5);
  });
});
