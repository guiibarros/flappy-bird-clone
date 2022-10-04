import { Engine } from '../engine';

import { gameScreen, context } from "../engine/context";
import { IGameObject } from '../engine/interfaces/IGameObject';
import { stateMachine, State } from "../engine/stateMachine";
import { Floor } from './Floor';

export class Bird implements IGameObject {
  // Position and scale Properties
  private x = gameScreen.width / 3;
  private y = gameScreen.height / 3;
  private width = 34;
  private height = 24;

  // Physics
  private gravity = 0.8;
  private mass = 0.3;
  private velocity = 0;
  private flapImpulse = 5;
  private angle = 0;
  private angleSpeed = 6;
  private angleLimit = 60;

  // Animation
  private animationSpeed = 4;
  private sprites = [
    { sX: 276, sY: 114, },
    { sX: 276, sY: 140, },
    { sX: 276, sY: 166, },
    { sX: 276, sY: 140, },
  ];

  private spriteIndex = 0;

  private spriteSheet: HTMLImageElement;

  private floor: Floor;

  public get position() {
    return {
      x: this.x,
      y: this.y
    };
  }

  public get scale() {
    return {
      width: this.width,
      height: this.height
    };
  }
  
  public init(): void {
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'assets/spritesheet.png';
    this.floor = Engine.getGameObject<Floor>('Floor');

    gameScreen.addEventListener('click', () => {
      switch(State.current) {
        case stateMachine.ready: {
    
          State.current = stateMachine.start;
    
          this.flap();
          break;
        }
    
        case stateMachine.start: {
          this.flap();
          break;
        }
      }
    });
  }

  public draw(): void {
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
  }

  public update(): void {
    this.checkFloorCollision();

    if (this.velocity < 0) {
      this.angle = Math.max(-this.angleLimit, this.angle - this.angleSpeed);
    } else if (this.velocity > 0) {
      this.angle = Math.min(this.angleLimit, this.angle + this.angleSpeed);
    }

    if (State.current !== stateMachine.over) {
      Engine.framesCount % this.animationSpeed === 0 && this.spriteIndex++;

      this.spriteIndex = this.spriteIndex % this.sprites.length;
    }

    this.y += this.velocity;
  }

  private applyGravity(): void {
    this.velocity += this.gravity * this.mass;
  }

  private flap(): void {
    this.velocity = -this.flapImpulse;
  }

  private checkFloorCollision(): void {
    if (State.current !== stateMachine.ready) {
      if ((this.y + this.height) >= this.floor.position.y) {
        State.setCurrent(stateMachine.over);
        this.die();
      } else {
        this.applyGravity();
      }
    }
  }

  private die(): void {
    this.y = this.floor.position.y - (this.height / 2);
    this.velocity = 0;
    this.spriteIndex = 0;
  }
};