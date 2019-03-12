import * as Phaser from 'phaser';

import * as bombSprite from './bombSprite.svg';
import {IGameObject} from '../IGameObject';

export class Bomb implements IGameObject {
  private static readonly DROP_SPEED = 400;
  private static readonly SPRITE_KEY = 'bomb';

  public boundaryCollider: Phaser.Physics.Arcade.Collider;
  public playerCollider: Phaser.Physics.Arcade.Collider;
  private scene: Phaser.Scene;
  public sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(initialX: number, initialY: number): void {
    this.sprite = this.scene.physics.add.sprite(initialX, initialY, Bomb.SPRITE_KEY);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setVelocityY(Bomb.DROP_SPEED);
  }

  public destroy(): void {
    if (this.playerCollider) {
      this.playerCollider.destroy();
      this.playerCollider = null;
    }
    
    if (this.boundaryCollider) {
      this.boundaryCollider.destroy();
      this.boundaryCollider = null;
    }

    this.sprite.destroy();
  }
  
  public static preload(scene: Phaser.Scene): void {
    scene.load.svg(this.SPRITE_KEY, bombSprite, {scale: 4});
  }

  public update(): void {}
}
