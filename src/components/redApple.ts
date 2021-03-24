import { Apple } from './apple';

export class RedApple extends Apple {
  constructor(x: number, y: number) {
    super(x, y, 1, '#f22');
  }
}

export default RedApple;
