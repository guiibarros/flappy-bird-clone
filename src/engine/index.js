import { context, gameScreen } from './context.js';
import { stateMachine } from './stateMachine.js';

export let framesCount = 0;

export const Engine = {
  gameObjects: [],

  createGameObjects(objects) {
    this.gameObjects.push(...objects);
  },

  draw() {
    // Clear the screen
    context.clearRect(0, 0, gameScreen.width, gameScreen.height);

    this.gameObjects.forEach(gameObject => gameObject.draw && gameObject.draw());
  },

  update() {
    this.gameObjects.forEach(gameObject => gameObject.update && gameObject.update());
  },

  loop() {
    this.update();
    this.draw();

    framesCount++;

    requestAnimationFrame(() => this.loop());
  },

  init() {
    this.gameObjects.forEach(gameObject => gameObject.init && gameObject.init());

    gameScreen.addEventListener('click', () => {
      switch(stateMachine.current) {
        case stateMachine.ready: {

          stateMachine.current = stateMachine.start;

          this.gameObjects.forEach(gameObject => gameObject.flap && gameObject.flap());
          break;
        }

        case stateMachine.start: {
          this.gameObjects.forEach(gameObject => gameObject.flap && gameObject.flap());
          break;
        }
      }
    });

    this.loop();
  }
};