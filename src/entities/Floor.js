import { gameScreen, context } from '../engine/context.js';
import { stateMachine } from '../engine/stateMachine.js';

export const Floor = {
  x: 0,
  y: gameScreen.height - 112,
  sX: 276,
  sY: 0,
  width: 224,
  height: 112,
  xSpeed: 2,

  spriteSheet: null,
  
  init() {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
  },

  draw() {
    // Draw two floors to fill the screen
    context.drawImage(
      this.spriteSheet,
      this.sX,
      this.sY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.drawImage(
      this.spriteSheet,
      this.sX,
      this.sY,
      this.width,
      this.height,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  },

  update() {
    // If the floor x mod gameScreen.width / 2 is equal to zero, then, reset the x
    if (stateMachine.current !== stateMachine.over) {
      this.x = (this.x - this.xSpeed) % (gameScreen.width / 2);
    }
  }
};