export interface IGameObject {
  create(initialX: number, initialY: number): void;
  preload(): void;
  update(): void;
}
