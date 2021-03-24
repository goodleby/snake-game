import { GameCoordinates } from './game';

export class Apple {
  coordinates: GameCoordinates;
  score: number;
  color: string;

  constructor(x: number, y: number, score: number, color: string) {
    this.coordinates = { x, y };
    this.score = score;
    this.color = color;
  }
}

export default Apple;
