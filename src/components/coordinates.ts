import { GameCoordinates } from './game';

export type direction = 'left' | 'right' | 'up' | 'down';

export const moveCoordinates = (
  coordinates: GameCoordinates,
  direction: direction
): GameCoordinates => {
  let { x, y } = coordinates;
  switch (direction) {
    case 'left':
      x--;
      break;
    case 'right':
      x++;
      break;
    case 'up':
      y--;
      break;
    case 'down':
      y++;
      break;
  }
  return { x, y };
};

export const getOpposite = (direction: direction): direction => {
  const opposite: { [key: string]: direction } = {
    left: 'right',
    right: 'left',
    up: 'down',
    down: 'up',
  };
  return opposite[direction];
};
