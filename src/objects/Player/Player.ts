import * as Phaser from 'phaser';

import * as playerSpriteSheet from './playerSpriteSheet.svg';
import {IGameObject} from '../IGameObject';

export class Player implements IGameObject {
  private static readonly BASE_SPEED = 1800;
  private static readonly MAX_LIVES = 3;
  private static readonly SPLASH_ANIMATION_KEY = 'splash';
  private static readonly SPLASH_ANIMATION_FRAME_RATE = 10;
  private static readonly SPRITESHEET_KEY = 'player';

  private aKey: Phaser.Input.Keyboard.Key;
  private currentLives = Player.MAX_LIVES;
  private dKey: Phaser.Input.Keyboard.Key;
  private leftKey: Phaser.Input.Keyboard.Key;
  public paddleSprites: {
    bottom: Phaser.Physics.Arcade.Sprite;
    middle: Phaser.Physics.Arcade.Sprite;
    top: Phaser.Physics.Arcade.Sprite;
  };
  private rightKey: Phaser.Input.Keyboard.Key;
  private scene: Phaser.Scene;
  public spriteGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public get isAlive() {
    return this.currentLives > 0;
  }

  public addLife(): void {
    if (this.currentLives < Player.MAX_LIVES) {
      this.setLives(this.currentLives + 1);
    }
  }

  public animateSplash(playerPaddle: Phaser.Physics.Arcade.Sprite,): void {
    playerPaddle.anims.play(Player.SPLASH_ANIMATION_KEY);
  }

  public create(initialX: number, initialY: number): void {
    this.paddleSprites = {
      bottom: this.scene.physics.add.sprite(initialX, initialY, Player.SPRITESHEET_KEY, 0),
      middle: this.scene.physics.add.sprite(initialX, initialY - 90, Player.SPRITESHEET_KEY, 0),
      top: this.scene.physics.add.sprite(initialX, initialY - 180, Player.SPRITESHEET_KEY, 0),
    };

    this.scene.anims.create({
      key: Player.SPLASH_ANIMATION_KEY,
      frameRate: Player.SPLASH_ANIMATION_FRAME_RATE,
      frames: this.scene.anims.generateFrameNumbers(Player.SPRITESHEET_KEY, {frames: [0, 1, 2, 3, 0]}),
    });

    this.spriteGroup = this.scene.physics.add.group([
      this.paddleSprites.bottom,
      this.paddleSprites.middle,
      this.paddleSprites.top,
    ]);
    
    this.spriteGroup.children.iterate((childObject) => {
      const child = childObject as Phaser.Physics.Arcade.Sprite;
      
      child.body.setSize(28 * 5, 8 * 5);
      child.body.setOffset(0, 7 * 5);
      child.setCollideWorldBounds(true);
    });

    this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  public destroy(): void {
    this.spriteGroup.destroy(true);
  }
  
  public static preload(scene: Phaser.Scene): void {
    const RAW_SPRITESHEET_KEY = `${Player.SPRITESHEET_KEY}_raw`;
    scene.load.svg(RAW_SPRITESHEET_KEY, playerSpriteSheet, {scale: 5});

    scene.load.on('filecomplete', (key: string, type: object, data: {getSourceImage: Function}) => {
      if (key === RAW_SPRITESHEET_KEY) {
        scene.textures.addSpriteSheet(Player.SPRITESHEET_KEY, data.getSourceImage(), {
          frameHeight: 15 * 5,
          frameWidth: 28 * 5,
          spacing: 1 * 5,
        });
      }
    });
  }

  public removeLife(): void {
    this.setLives(this.currentLives - 1);
  }

  public resetLives(): void {
    this.setLives(Player.MAX_LIVES);
  }

  private setLives(newAmount: number) {
    this.currentLives = newAmount;

    if (this.currentLives >= 1) {
      this.paddleSprites.top.enableBody(false, null, null, true, true);
      this.paddleSprites.top.setVisible(true);
    } else {
      this.paddleSprites.top.disableBody();
      this.paddleSprites.top.setVisible(false);
    }

    if (this.currentLives >= 2) {
      this.paddleSprites.middle.enableBody(false, null, null, true, true);
      this.paddleSprites.middle.setVisible(true);
    } else {
      this.paddleSprites.middle.disableBody();
      this.paddleSprites.middle.setVisible(false);
    }

    if (this.currentLives >= 3) {
      this.paddleSprites.bottom.enableBody(false, null, null, true, true);
      this.paddleSprites.bottom.setVisible(true);
    } else {
      this.paddleSprites.bottom.disableBody();
      this.paddleSprites.bottom.setVisible(false);
    }
  }

  public update(): void {
    let speed = 0;

    if (this.aKey.isDown || this.leftKey.isDown) {
      speed -= Player.BASE_SPEED;
    }

    if (this.dKey.isDown || this.rightKey.isDown) {
      speed += Player.BASE_SPEED;
    }

    this.spriteGroup.setVelocityX(speed);
  }
}
