import { framesCount } from '../engine/index.js';
import { context, gameScreen } from '../engine/context.js';
import { stateMachine } from '../engine/stateMachine.js';

import { Bird } from './Bird.js';

export const Pipes = {
  // Properties in the canvas
  width: 52,
  height: 400,
  gap: 100,
  xSpeed: 2,
  pipesGenerationInterval: 120, // frames interval
  instances: [],

  // Animation
  sprites: [
    { sX: 502, sY: 0 },
    { sX: 554, sY: 0 },
  ],

  spriteSheet: null,
  
  init() {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
  },

  draw() {
    this.instances.forEach(pipe => {
      const pipeBottom = this.sprites[0];
      const pipeTop = this.sprites[1];

      const pipeBottomY = pipe.y + this.height + this.gap;

      context.drawImage(
        this.spriteSheet,
        pipeTop.sX,
        pipeTop.sY,
        this.width,
        this.height,
        pipe.x,
        pipe.y,
        this.width,
        this.height,
      );

      context.drawImage(
        this.spriteSheet,
        pipeBottom.sX,
        pipeBottom.sY,
        this.width,
        this.height,
        pipe.x,
        pipeBottomY,
        this.width,
        this.height,
      );
    });
  },

  update() {
    if (stateMachine.current === stateMachine.start) {
      this.generatePipes();
    }

    this.instances.forEach(pipe => {
      if (stateMachine.current === stateMachine.start){
        pipe.x -= this.xSpeed;
      }

      if (pipe.x < -this.width) {
        this.instances.shift();
      }

      if (
        (pipe.x < (Bird.x + (Bird.width / 3)) &&
        pipe.x + this.width > Bird.x) &&
        (pipe.y + this.height > Bird.y - (Bird.height / 2) ||
        pipe.y + this.height + this.gap < Bird.y + (Bird.height / 2))
      ) {
        stateMachine.current = stateMachine.over;
      }
    });
  },

  generatePipes() {
    if (framesCount % this.pipesGenerationInterval === 0) {
      this.instances.push({
        x: gameScreen.width * 1.5,
        y: Math.floor(Math.random() * (-125 + 325) - 325)
      });
    }
  }
};