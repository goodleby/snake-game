import { Apple } from './apple';

export class OrangeApple extends Apple {
  constructor(x: number, y: number) {
    super(x, y, 2, '#fc6');
  }
}

export default OrangeApple;
