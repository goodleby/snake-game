import { Coordinates, direction } from '../../interfaces';
import { moveCoordinates } from '../coordinates';

export class Snake {
  length: number;
  body: Coordinates[];

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
