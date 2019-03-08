import * as Phaser from 'phaser';

import {IGameObject} from '@app/objects/IGameObject';
import {Player} from '@app/objects/Player';
import {Prisoner} from '@app/objects/Prisoner';

export class GameScene extends Phaser.Scene {
  private gameObjects: Array<IGameObject> = [];
  private player: Player;
  private prisoner: Prisoner;

  constructor() {
    super('GameScene');

    this.prisoner = new Prisoner(this);
    this.gameObjects.push(this.prisoner);

    this.player = new Player(this);
    this.gameObjects.push(this.player);
  }

  public create(): void {
    const worldHeight = this.game.scale.height;
    const worldWidth = this.game.scale.width;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    this.prisoner.create(worldWidth * 0.8, worldHeight * 0.2);
    this.player.create(worldWidth * 0.5, worldHeight * 0.95);
  }

  public preload(): void {
    this.gameObjects.forEach(gameObject => gameObject.preload());
  }

  public update(): void {
    this.prisoner.update();
    this.player.update();
  }
}
