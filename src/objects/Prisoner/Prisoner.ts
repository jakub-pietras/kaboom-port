import * as Phaser from 'phaser';

import * as prisonerSprite from './prisonerSprite.svg';
import {IGameObject} from '../IGameObject';
import {MAX_SPEED_LEVEL, MIN_SPEED_LEVEL, speedLevelsMap} from './speedLevelsMap';

export class Prisoner implements IGameObject {
  private static readonly BASE_DIRECTION_CHANGE_CHANCE = 0.005;
  private static readonly MAX_DIRECTION_CHANGE_TIME = 3000;
  private static readonly MIN_DIRECTION_CHANGE_TIME = 150;
  private static readonly SPRITE_KEY = 'prisoner';

  private blockMovement = false;
  private directionModifier = Math.random() > 0.5 ? 1 : -1;
  private lastDirectionChange: number;
  private scene: Phaser.Scene;
  public speedLevel = MIN_SPEED_LEVEL;
  public sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private get shouldChangeDirection(): boolean {
    if (this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
      return true;
    }

    const timeSinceLastChange = this.scene.time.now - this.lastDirectionChange;

    if (timeSinceLastChange > Prisoner.MAX_DIRECTION_CHANGE_TIME) {
      return true;
    } else if (timeSinceLastChange > Prisoner.MIN_DIRECTION_CHANGE_TIME) {
      return Math.random() <= Prisoner.BASE_DIRECTION_CHANGE_CHANCE * this.speedLevel;
    }

    return false;
  }

  public create(initialX: number, initialY: number): void {
    this.lastDirectionChange = this.scene.time.now;

    this.sprite = this.scene.physics.add.sprite(initialX, initialY, Prisoner.SPRITE_KEY);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setOrigin(0.5, 0.9);
  }

  public destroy(): void {
    this.sprite.destroy();
  }

  public lowerSpeedLevel(): void {
    if (this.speedLevel > MIN_SPEED_LEVEL) {
      this.speedLevel--;
    }
  }
  
  public static preload(scene: Phaser.Scene): void {
    scene.load.svg(Prisoner.SPRITE_KEY, prisonerSprite, {scale: 5});
  }

  public riseSpeedLevel(): void {
    if (this.speedLevel < MAX_SPEED_LEVEL) {
      this.speedLevel++;
    }
  }

  public startMovement(): void {
    this.blockMovement = false;
  }

  public stopMovement(): void {
    this.blockMovement = true;
  }

  public update(): void {
    if (this.blockMovement) {
      this.sprite.setVelocityX(0);
      return;
    }

    if (this.shouldChangeDirection) {
      this.directionModifier *= -1;
      this.lastDirectionChange = this.scene.time.now;
    }

    const speed = speedLevelsMap.get(this.speedLevel);
    this.sprite.setVelocityX(speed * this.directionModifier);
  }
}
