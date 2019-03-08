import * as Phaser from 'phaser';

import {GameScene} from '@app/scenes/GameScene';

export class KaboomGame {
  constructor() {
    new Phaser.Game({
      backgroundColor: '#95a5a6',
      fps: {
        min: 60,
        target: 100,
      },
      height: 1000,
      input: {
        touch: false,
      },
      parent: 'game-root-node',
      physics: {
        default: 'arcade',
      },
      scene: [GameScene],
      title: 'Kaboom!',
      type: Phaser.AUTO,
      version: '1.0.0',
      width: 1000,
    });
  }
}
