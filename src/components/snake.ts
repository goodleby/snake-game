import { GameCoordinates } from './game';
import { direction, moveCoordinates } from './coordinates';

export class Snake {
  length: number;
  body: GameCoordinates[];

  constructor(x: number, y: number, length: number) {
    this.length = length;
    this.body = [{ x, y }];
  }

  move(direction: direction) {
    const coordinates = moveCoordinates(this.body[0], direction);
    this.body.unshift(coordinates);
    this.body = this.body.slice(0, this.length);
  }

  grow(amount = 1) {
    this.length += amount;
  }
}

export default Snake;
