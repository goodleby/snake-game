import { getRandBool, getRandNum, onSwipe } from '@goodleby/lib';
import { direction, getOpposite } from './coordinates';
import Snake from './snake';
import Apple from './apple';
import RedApple from './redApple';
import OrangeApple from './orangeApple';

export interface GameCoordinates {
  x: number;
  y: number;
}

export class Game {
  area: number;
  root: Element;
  messages: HTMLElement;
  score: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  snake: Snake;
  lastDirection!: direction;
  queue: direction[] = [];
  apples: Apple[] = [];

  _play = false;
  fieldSize = 15;
  cellSize = 25;
  startLength = 3;
  speed = 200;
  orangeAppleSpawnRate = 0.02;
  orangeAppleDuration = 7000;

  constructor(selector: string) {
    this.area = this.fieldSize ** 2;
    const root = document.querySelector(selector);
    if (!root) {
      throw new Error('Passed `selector` did not match any DOM element');
    }
    this.root = root;
    this.root.innerHTML = '';

    this.messages = document.createElement('div');
    this.messages.classList.add('messages');

    this.score = document.createElement('div');
    this.score.classList.add('score');

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.fieldSize * this.cellSize;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas did not return context');
    }
    this.ctx = ctx;

    this.root.append(this.messages);
    this.root.append(this.score);
    this.root.append(this.canvas);

    const midPoint = Math.floor(this.fieldSize / 2);
    this.snake = new Snake(midPoint, midPoint, this.startLength);
    this.loop = this.loop.bind(this);

    window.addEventListener('keyup', (e) => {
      if (this.lastDirection && !this._play) return;
      let direction: direction | null = null;
      switch (e.code) {
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
      }
      if (direction && direction !== this.queue[0]) {
        this.queue.unshift(direction);
        this.queue = this.queue.slice(0, 2);
        if (!this.lastDirection) this.play();
      }
    });

    onSwipe(document.body, (_, direction) => {
      if (this.lastDirection && !this._play) return;
      if (direction !== this.queue[0]) {
        this.queue.unshift(direction);
        this.queue = this.queue.slice(0, 2);
        if (!this.lastDirection) this.play();
      }
    });

    this.render();
    this.updateScore();
  }

  play() {
    this._play = true;
    this.loop();
  }

  pause() {
    this._play = false;
  }

  getRandCoords(): GameCoordinates {
    const snakeCells = this.snake.body.map(
      ({ x, y }) => y * this.fieldSize + x
    );
    const applesCells = this.apples.map(
      ({ coordinates: { x, y } }) => y * this.fieldSize + x
    );
    const skipCells = ([] as number[]).concat(snakeCells, applesCells);

    const cellIndex = getRandNum(0, this.area - 1, skipCells);
    const y = Math.floor(cellIndex / this.fieldSize);
    const x = cellIndex - y * this.fieldSize;

    return { x, y };
  }

  clearField() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }

  renderField() {
    const { fieldSize, ctx, cellSize } = this;
    ctx.fillStyle = '#000';
    for (let x = 0; x < fieldSize; x++) {
      for (let y = 0; y < fieldSize; y++) {
        ctx.fillRect(
          x * cellSize + 1,
          y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        );
      }
    }
  }

  renderSnake() {
    const { ctx, cellSize } = this;
    const { body } = this.snake;
    ctx.fillStyle = '#2f4';
    body.forEach((coords) => {
      const { x, y } = coords;
      ctx.fillRect(
        x * cellSize + 1,
        y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });
  }

  moveSnake() {
    const { queue, lastDirection } = this;
    for (let i = queue.length - 1; i >= 0; i--) {
      if (queue[i] !== getOpposite(lastDirection) && queue[i] !== lastDirection)
        break;
      else queue.splice(i, 1);
    }
    const direction = queue.pop() || lastDirection;
    this.snake.move(direction);
    this.lastDirection = direction;
  }

  renderApples() {
    const { ctx, cellSize, apples } = this;
    apples.forEach((apple) => {
      const { x, y } = apple.coordinates;
      ctx.fillStyle = apple.color;
      ctx.fillRect(
        x * cellSize + 1,
        y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });
  }

  spawnRedApple() {
    const { x, y } = this.getRandCoords();
    const apple = new RedApple(x, y);
    this.apples.push(apple);
  }

  needRedApple(): boolean {
    return !this.apples.find((apple) => apple instanceof RedApple);
  }

  spawnOrangeApple() {
    const { x, y } = this.getRandCoords();
    const apple = new OrangeApple(x, y);
    this.apples.push(apple);
    setTimeout(() => {
      const index = this.apples.indexOf(apple);
      if (index !== -1) this.apples.splice(index, 1);
    }, this.orangeAppleDuration);
  }

  needOrangeApple(): boolean {
    return (
      !this.apples.find((apple) => apple instanceof OrangeApple) &&
      getRandBool(this.orangeAppleSpawnRate)
    );
  }

  checkLose(): boolean {
    const { fieldSize, snake } = this;
    const { x, y } = snake.body[0];
    return (
      x < 0 ||
      x > fieldSize - 1 ||
      y < 0 ||
      y > fieldSize - 1 ||
      snake.body.slice(1).some((coords) => coords.x === x && coords.y === y)
    );
  }

  lose() {
    this.pause();
    this.showMessage('Sorry, you lost.', 'danger');
  }

  checkWin(): boolean {
    const { area, snake } = this;
    return snake.body.length === area;
  }

  win() {
    this.pause();
    this.showMessage('You won!', 'success');
  }

  checkAppleCollisions() {
    const { x, y } = this.snake.body[0];
    this.apples.forEach((apple) => {
      const { coordinates, score } = apple;
      if (coordinates.x === x && coordinates.y === y) {
        this.snake.grow(score);
        this.updateScore();
        this.apples.splice(this.apples.indexOf(apple), 1);
      }
    });
  }

  render() {
    this.clearField();
    this.renderField();
    this.renderSnake();
    this.renderApples();
  }

  showMessage(text: string, type: 'info' | 'success' | 'danger' = 'info') {
    const message = document.createElement('div');
    message.classList.add('message', type);
    message.innerText = text;
    this.messages.append(message);
  }

  updateScore() {
    this.score.innerText = `Your score: ${this.snake.length}`;
  }

  loop() {
    if (this.needRedApple()) this.spawnRedApple();
    if (this.needOrangeApple()) this.spawnOrangeApple();
    this.moveSnake();
    this.checkAppleCollisions();
    if (this.checkLose()) return this.lose();
    if (this.checkWin()) this.win();
    this.render();
    if (this._play)
      setTimeout(() => requestAnimationFrame(this.loop), this.speed);
  }
}

export default Game;
