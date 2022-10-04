import { context, gameScreen } from './context';
import { IGameObject } from './interfaces/IGameObject';

export class Engine {
  private static gameObjects: IGameObject[] = [];
  public static framesCount = 0;

  public static createGameObjects(objects: IGameObject[]): void {
    Engine.gameObjects.push(...objects);
  }

  public static getGameObject<T = IGameObject>(objectName: string): T {
    return this.gameObjects.find(gameObject => gameObject.constructor.name === objectName) as T;
  }

  private static draw(): void {
    context.clearRect(0, 0, gameScreen.width, gameScreen.height);

    Engine.gameObjects.forEach(gameObject => gameObject.draw && gameObject.draw());
  }

  private static update() {
    Engine.gameObjects.forEach(gameObject => gameObject.update && gameObject.update());
  }

  private static loop() {
    Engine.update();
    Engine.draw();

    Engine.framesCount++;

    requestAnimationFrame(() => Engine.loop());
  }

  public static init() {
    Engine.gameObjects.forEach(gameObject => gameObject.init && gameObject.init());

    Engine.loop();
  }
};