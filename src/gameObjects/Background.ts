import { context, gameScreen } from "../engine/context";
import { IGameObject } from "../engine/interfaces/IGameObject";

export class Background implements IGameObject {
  private x = 0;
  private y = gameScreen.height - 227;
  private width = 276;
  private height = 227;
  private sX = 0;
  private sY = 0;
  private spriteSheet: HTMLImageElement;
  
  public init(): void {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
  }

  public draw(): void {
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
  }
};