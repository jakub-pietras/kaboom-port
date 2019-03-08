import * as Phaser from 'phaser';

import {IGameObject} from '@app/objects/IGameObject';
import {Prisoner} from '@app/objects/Prisoner';

export class GameScene extends Phaser.Scene {
  private gameObjects: Array<IGameObject> = [];
  private prisoner: Prisoner;

  constructor() {
    super('GameScene');

    this.prisoner = new Prisoner(this);
    this.gameObjects.push(this.prisoner);
  }

  public create(): void {
    this.physics.world.setBounds(0, 0, this.game.scale.width, this.game.scale.height);

    this.prisoner.create(this.game.scale.width * 0.8, this.game.scale.height * 0.2);
  }

  public preload(): void {
    this.gameObjects.forEach(gameObject => gameObject.preload());
  }

  public update(): void {
    this.prisoner.update();
  }
}
