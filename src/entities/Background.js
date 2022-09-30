import { context } from "../engine/context.js";

export const Background = {
  x: 0,
  y: gameScreen.height - 227,
  width: 276,
  height: 227,
  sX: 0,
  sY: 0,
  spriteSheet: null,
  
  init() {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
  },

  draw() {
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
  },
};