import * as Phaser from 'phaser';

export class KaboomGame {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game({
      backgroundColor: '#95a5a6',
      fps: {
        min: 60,
        target: 100,
      },
      height: 800,
      input: {
        touch: false,
      },
      parent: 'game-root-node',
      scene: {
        create: this.create,
        preload: this.preload,
        update: this.update,
      },
      title: 'Kaboom!',
      type: Phaser.AUTO,
      version: '1.0.0',
      width: 1200,
    });
  }

  create = () => {};

  preload = () => {};

  update = () => {};
}
