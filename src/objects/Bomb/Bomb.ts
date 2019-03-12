import * as Phaser from 'phaser';

import * as bombSpriteSheet from './bombSpriteSheet.svg';
import {IGameObject} from '../IGameObject';

export class Bomb implements IGameObject {
  private static readonly DROP_SPEED = 400;
  private static readonly LIT_FUSE_ANIMATION_KEY = 'lit_fuse';
  private static readonly LIT_FUSE_ANIMATION_FRAME_RATE = 45;
  private static readonly SPRITESHEET_KEY = 'bomb';

  public boundaryCollider: Phaser.Physics.Arcade.Collider;
  public playerBottomPaddleCollider: Phaser.Physics.Arcade.Collider;
  public playerMiddlePaddleCollider: Phaser.Physics.Arcade.Collider;
  public playerTopPaddleCollider: Phaser.Physics.Arcade.Collider;
  private scene: Phaser.Scene;
  public sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(initialX: number, initialY: number): void {
    this.sprite = this.scene.physics.add.sprite(initialX, initialY, Bomb.SPRITESHEET_KEY);
    
    this.scene.anims.create({
      key: Bomb.LIT_FUSE_ANIMATION_KEY,
      frameRate: Bomb.LIT_FUSE_ANIMATION_FRAME_RATE,
      frames: this.scene.anims.generateFrameNumbers(Bomb.SPRITESHEET_KEY, {
        frames: Phaser.Utils.Array.Shuffle([0, 1, 2, 3]),
      }),
      repeat: -1,
    });
    this.sprite.anims.load(Bomb.LIT_FUSE_ANIMATION_KEY);
    this.sprite.anims.play(Bomb.LIT_FUSE_ANIMATION_KEY);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setFlipX(Math.random() > 0.5);
    this.sprite.setVelocityY(Bomb.DROP_SPEED);
  }

  public destroy(): void {
    if (this.playerBottomPaddleCollider) {
      this.playerBottomPaddleCollider.destroy();
      this.playerBottomPaddleCollider = null;
    }

    if (this.playerMiddlePaddleCollider) {
      this.playerMiddlePaddleCollider.destroy();
      this.playerMiddlePaddleCollider = null;
    }

    if (this.playerTopPaddleCollider) {
      this.playerTopPaddleCollider.destroy();
      this.playerTopPaddleCollider = null;
    }
    
    if (this.boundaryCollider) {
      this.boundaryCollider.destroy();
      this.boundaryCollider = null;
    }

    this.sprite.destroy();
  }
  
  public static preload(scene: Phaser.Scene): void {
    const RAW_SPRITESHEET_KEY = `${Bomb.SPRITESHEET_KEY}_raw`;
    scene.load.svg(RAW_SPRITESHEET_KEY, bombSpriteSheet, {scale: 4});

    scene.load.on('filecomplete', (key: string, type: object, data: {getSourceImage: Function}) => {
      if (key === RAW_SPRITESHEET_KEY) {
        scene.textures.addSpriteSheet(Bomb.SPRITESHEET_KEY, data.getSourceImage(), {
          frameHeight: 15 * 4,
          frameWidth: 10 * 4,
          spacing: 1 * 4,
        });
      }
    });
  }

  public update(): void {}
}
