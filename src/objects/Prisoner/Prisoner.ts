import * as Phaser from 'phaser';

import * as prisonerSprite from './prisonerSprite.svg';
import {IGameObject} from '../IGameObject';
import {MAX_SPEED_LEVEL, MIN_SPEED_LEVEL, speedLevelsMap} from './speedLevelsMap';

export class Prisoner implements IGameObject {
  private readonly BASE_DIRECTION_CHANGE_CHANCE = 0.005;
  private readonly MAX_DIRECTION_CHANGE_TIME = 3000;
  private readonly MIN_DIRECTION_CHANGE_TIME = 150;
  private readonly SPRITE_KEY = 'prisoner';

  private directionModifier = Math.random() > 0.5 ? 1 : -1;
  private lastDirectionChange: number;
  private position: { x: number; y: number; };
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

    if (timeSinceLastChange > this.MAX_DIRECTION_CHANGE_TIME) {
      return true;
    } else if (timeSinceLastChange > this.MIN_DIRECTION_CHANGE_TIME) {
      return Math.random() <= this.BASE_DIRECTION_CHANGE_CHANCE * this.speedLevel;
    }

    return false;
  }

  public create(initialX: number, initialY: number): void {
    this.lastDirectionChange = this.scene.time.now;
    this.position = {x: initialX, y: initialY};

    this.sprite = this.scene.physics.add.sprite(this.position.x, this.position.y, this.SPRITE_KEY);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setOrigin(0.5, 0.9);
  }

  public lowerSpeedLevel(): void {
    if (this.speedLevel > MIN_SPEED_LEVEL) {
      this.speedLevel--;
    }
  }
  
  public preload(): void {
    this.scene.load.svg(this.SPRITE_KEY, prisonerSprite, {width: 63, height: 135});
  }

  public riseSpeedLevel(): void {
    if (this.speedLevel < MAX_SPEED_LEVEL) {
      this.speedLevel++;
    }
  }

  public update(): void {
    if (this.shouldChangeDirection) {
      this.directionModifier *= -1;
      this.lastDirectionChange = this.scene.time.now;
    }

    const speed = speedLevelsMap.get(this.speedLevel);
    this.sprite.setVelocity(speed * this.directionModifier, 0);
  }
}
