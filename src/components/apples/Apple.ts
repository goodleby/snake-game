import { Coordinates } from '../../interfaces';

export class Apple {
  coordinates: Coordinates;
  score: number;
  color: string;

  constructor(x: number, y: number, score: number, color: string) {
    this.coordinates = { x, y };
    this.score = score;
    this.color = color;
  }
}
