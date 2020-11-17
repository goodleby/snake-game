import { getRandBool, getRandNum } from '../../libs/math';
import { direction } from '../../interfaces';
import { Snake } from '../snake';
import { Apple, RedApple, OrangeApple } from '../apples';
import { moveCoordinates, getOpposite } from '../coordinates';

export class Game {
  _play: boolean;
  fieldSize: number;
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  snake: Snake;
  lastDirection: direction;
  directions: direction[] = [];
  apples: Apple[] = [];

  cellSize = 30;
  fieldBackground = '#000';
  startLength = 3;
  speed = 150;
  orangeAppleSpawnRate = 0.02;
  orangeAppleDuration = 10000;

  constructor(selector: string, fieldSize: number) {
    this.fieldSize = fieldSize;
    this.root = document.querySelector(selector);
    this.root.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.fieldSize * this.cellSize;
    this.ctx = this.canvas.getContext('2d');

    this.root.append(this.canvas);

    const midPoint = Math.floor(this.fieldSize / 2);
    this.snake = new Snake(midPoint, midPoint, this.startLength);
    this.loop = this.loop.bind(this);

    window.addEventListener('keyup', (e) => {
      if (this.lastDirection && !this._play) return;
      let direction: direction;
      switch (e.key) {
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
      if (direction && direction !== this.directions[0]) {
        this.directions.unshift(direction);
        this.directions = this.directions.slice(0, 5);
        if (!this.lastDirection) this.play();
      }
    });

    this.render();
  }

  play() {
    this._play = true;
    this.loop();
    console.log('Game started');
  }

  pause() {
    this._play = false;
    console.log('Game paused');
  }

  getRandCoords() {
    const skipCells = this.snake.body.map(({ x, y }) => y * this.fieldSize + x);
    const emptyCells = [];
    for (let i = 0; i < this.fieldSize ** 2; i++) {
      if (skipCells.find((index) => index === i)) continue;
      const y = Math.floor(i / this.fieldSize);
      const x = i - y * this.fieldSize;
      emptyCells.push({ x, y });
    }
    return emptyCells[getRandNum(emptyCells.length)];
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
        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
      }
    }
  }

  renderSnake() {
    const { ctx, cellSize } = this;
    const { body } = this.snake;
    ctx.fillStyle = '#2f4';
    body.forEach((coords) => {
      const { x, y } = coords;
      ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    });
  }

  moveSnake() {
    const { directions, lastDirection } = this;
    const direction = directions.find((direction) => direction !== getOpposite(lastDirection));
    this.snake.move(direction);
    this.lastDirection = direction;
  }

  renderApples() {
    const { ctx, cellSize, apples } = this;
    apples.forEach((apple) => {
      const { x, y } = apple.coordinates;
      ctx.fillStyle = apple.color;
      ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
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

  checkRules(): boolean {
    const { fieldSize, lastDirection, directions } = this;
    const direction = directions.find((direction) => direction !== getOpposite(lastDirection));
    const { body } = this.snake;
    const { x, y } = moveCoordinates(body[0], direction);
    return !(
      x < 0 ||
      x > fieldSize - 1 ||
      y < 0 ||
      y > fieldSize - 1 ||
      body.some((coords) => coords.x === x && coords.y === y)
    );
  }

  checkAppleCollisions() {
    const { x, y } = this.snake.body[0];
    this.apples.forEach((apple) => {
      const { coordinates, score } = apple;
      if (coordinates.x === x && coordinates.y === y) {
        this.snake.grow(score);
        this.apples.splice(this.apples.indexOf(apple), 1);
      }
    });
  }

  render() {
    this.renderField();
    this.renderSnake();
    this.renderApples();
  }

  loop() {
    if (!this.checkRules()) return this.pause();
    if (this.needRedApple()) this.spawnRedApple();
    if (this.needOrangeApple()) this.spawnOrangeApple();
    this.clearField();
    this.moveSnake();
    this.checkAppleCollisions();
    this.render();
    if (this._play) setTimeout(() => requestAnimationFrame(this.loop), this.speed);
  }
}
