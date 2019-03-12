export interface IGameObject {
  create(initialX: number, initialY: number): void;
  destroy(): void;
  update(): void;
}
