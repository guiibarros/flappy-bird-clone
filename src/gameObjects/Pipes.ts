import { Engine } from '../engine';
import { context, gameScreen } from '../engine/context';
import { IGameObject } from '../engine/interfaces/IGameObject';
import { stateMachine, State } from '../engine/stateMachine';

import { Bird } from './Bird';

export class Pipes implements IGameObject {
  // Properties in the canvas
  private width = 52;
  private height = 400;
  private gap = 100;
  private xSpeed = 2;
  private pipesGenerationInterval = 120; // frames interval
  private instances = [];

  // Animation
  private sprites = [
    { sX: 502, sY: 0 },
    { sX: 554, sY: 0 },
  ];

  private spriteSheet: HTMLImageElement;

  private bird: Bird;
  
  public init(): void {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
    this.bird = Engine.getGameObject<Bird>('Bird');
  }

  public draw(): void {
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
  }

  public update(): void {
    if (State.current === stateMachine.start) {
      this.generatePipes();
    }

    this.instances.forEach(pipe => {
      if (State.current === stateMachine.start){
        pipe.x -= this.xSpeed;
      }

      if (pipe.x < -this.width) {
        this.instances.shift();
      }

      if (
        (pipe.x < (this.bird.position.x + (this.bird.scale.width / 3)) &&
        pipe.x + this.width > this.bird.position.x) &&
        (pipe.y + this.height > this.bird.position.y - (this.bird.scale.height / 2) ||
        pipe.y + this.height + this.gap < this.bird.position.y + (this.bird.scale.height / 2))
      ) {
        State.setCurrent(stateMachine.over);
      }
    });
  }

  private generatePipes(): void {
    if (Engine.framesCount % this.pipesGenerationInterval === 0) {
      this.instances.push({
        x: gameScreen.width * 1.5,
        y: Math.floor(Math.random() * (-125 + 325) - 325)
      });
    }
  }
};