import { gameScreen, context } from '../engine/context';
import { IGameObject } from '../engine/interfaces/IGameObject';
import { stateMachine, State } from '../engine/stateMachine';

export class Floor implements IGameObject {
  private x = 0;
  private y = gameScreen.height - 112;
  private sX = 276;
  private sY = 0;
  private width = 224;
  private height = 112;
  private xSpeed = 2;

  private spriteSheet: HTMLImageElement;
  
  public get position() {
    return {
      x: this.x,
      y: this.y
    };
  }

  public init(): void {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
  }

  public draw(): void {
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

    context.drawImage(
      this.spriteSheet,
      this.sX,
      this.sY,
      this.width,
      this.height,
      this.x + this.width * 2,
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
      this.x + this.width * 3,
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
      this.x + this.width * 4,
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
      this.x + this.width * 5,
      this.y,
      this.width,
      this.height
    );
  }

  public update(): void {
    // If the floor x mod gameScreen.width / 2 is equal to zero, then, reset the x
    if (State.current !== stateMachine.over) {
      this.x = (this.x - this.xSpeed) % (gameScreen.width / 2);
    }
  }
};