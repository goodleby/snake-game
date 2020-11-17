import { Coordinates, direction } from '../../interfaces';

export const moveCoordinates = (
  coordinates: Coordinates,
  direction: direction
): Coordinates => {
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
