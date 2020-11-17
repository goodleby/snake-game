// Get random number with min and max, or if only one parameter get random number in the range [0; x - 1]
export const getRandNum = (min: number, max?: number): number => {
  if (max === undefined) return getRandNum(0, min - 1);
  else return Math.floor(Math.random() * (max - min + 1) + min);
};

// Get random boolean value with success rate
export const getRandBool = (rate: number = 0.5): boolean => Math.random() < rate;

// Round to demanded amount of decimals only if needed
export const roundTo = (number: number, decimals: number = 0): number =>
  Math.round(number * 10 ** decimals) / 10 ** decimals;

// Floor to demanded amount of decimals only if needed
export const floorTo = (number: number, decimals: number = 0): number =>
  Math.floor(number * 10 ** decimals) / 10 ** decimals;

// Ceil to demanded amount of decimals only if needed
export const ceilTo = (number: number, decimals: number = 0): number =>
  Math.ceil(number * 10 ** decimals) / 10 ** decimals;

// Get amount of decimals in a number
export const countDecimals = (number: number): number =>
  Math.floor(number) !== number ? number.toString().split('.')[1].length : 0;

// Get average number between all pagetrameters
export const avg = (...numbers: number[]): number =>
  numbers.reduce((acc, item) => acc + item) / numbers.length;

// Find Gratest Common Divisor of two numbers
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
