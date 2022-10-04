export interface IGameObject {
  init?(): void;
  draw?(): void;
  update?(): void;
}