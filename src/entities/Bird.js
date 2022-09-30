import { framesCount } from '../engine/index.js';

import { gameScreen, context } from "../engine/context.js";
import { stateMachine } from "../engine/stateMachine.js";
import { Floor } from './Floor.js';

export const Bird = {
  // Properties in the canvas
  x: gameScreen.width / 3,
  y: gameScreen.height / 3,
  width: 34,
  height: 24,

  // Physics
  gravity: 0.8,
  mass: 0.3,
  velocity: 0,
  flapImpulse: 5,
  angle: 0,
  angleSpeed: 6,
  angleLimit: 60,

  // Animation
  animationSpeed: 4,
  sprites: [
    { sX: 276, sY: 114, },
    { sX: 276, sY: 140, },
    { sX: 276, sY: 166, },
    { sX: 276, sY: 140, },
  ],

  spriteIndex: 0,

  spriteSheet: null,
  
  init() {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
  },

  draw() {
    const { sX, sY } = this.sprites[this.spriteIndex];

    const angleInRadian = (Math.PI * this.angle) / 180;

    context.save();
    context.translate(this.x, this.y);
    context.rotate(angleInRadian);
    context.drawImage(
      this.spriteSheet,
      sX,
      sY,
      this.width,
      this.height,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    );
    context.restore();
  },

  update() {
    this.checkFloorCollision();

    if (this.velocity < 0) {
      this.angle = Math.max(-this.angleLimit, this.angle - this.angleSpeed);
    } else if (this.velocity > 0) {
      this.angle = Math.min(this.angleLimit, this.angle + this.angleSpeed);
    }

    if (stateMachine.current !== stateMachine.over) {
      framesCount % this.animationSpeed === 0 && this.spriteIndex++;

      this.spriteIndex = this.spriteIndex % this.sprites.length;
    }

    this.y += this.velocity;
  },

  applyGravity() {
    this.velocity += this.gravity * this.mass;
  },

  flap() {
    this.velocity = -this.flapImpulse;
  },

  checkFloorCollision() {
    if (stateMachine.current !== stateMachine.ready) {
      if ((this.y + this.height) >= Floor.y) {
        stateMachine.current = stateMachine.over;
        this.die();
      } else {
        this.applyGravity();
      }
    }
  },

  die() {
    this.y = Floor.y - (this.height / 2);
    this.velocity = 0;
    this.spriteIndex = 0;
  }
};