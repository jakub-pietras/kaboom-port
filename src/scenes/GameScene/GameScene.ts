import * as Phaser from 'phaser';

import {Bomb} from '@app/objects/Bomb';
import {Player} from '@app/objects/Player';
import {Prisoner} from '@app/objects/Prisoner';

import {LevelController} from './LevelController';

export class GameScene extends Phaser.Scene {
  private static readonly BOMB_DROP_DELAY = 250;
  private static readonly GAME_PAUSE_DELAY = 2000;
  private static readonly SCENE_KEY = 'GameScene';

  private bombBoundary: Phaser.Physics.Arcade.Sprite;
  private bombs: Array<Bomb> = [];
  private dropTimer: Phaser.Time.TimerEvent;
  private levelController = new LevelController();
  private pauseTimer: Phaser.Time.TimerEvent;
  private player: Player;
  private prisoner: Prisoner;

  constructor() {
    super(GameScene.SCENE_KEY);

    this.player = new Player(this);
    this.prisoner = new Prisoner(this);
  }

  public create(): void {
    const worldHeight = this.game.scale.height;
    const worldWidth = this.game.scale.width;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    this.bombBoundary = this.physics.add.sprite(worldWidth / 2, worldHeight, null);
    this.bombBoundary.setOrigin(0.5, 1);
    this.bombBoundary.body.setSize(worldWidth, 1);
    this.bombBoundary.setAlpha(0);

    this.prisoner.create(worldWidth * 0.8, worldHeight * 0.2);
    this.player.create(worldWidth * 0.5, worldHeight * 0.95);

    this.dropTimer = this.time.addEvent({
      callback: this.dropBomb,
      callbackScope: this,
      delay: GameScene.BOMB_DROP_DELAY,
      loop: true,
    });
  }

  private destroyBomb(bombSprite: Phaser.Physics.Arcade.Sprite): void {
    const targetBomb = this.bombs.find(bomb => bomb.sprite === bombSprite);
    targetBomb.destroy();

    this.bombs = this.bombs.filter(bomb => bomb.sprite !== bombSprite);
  }

  private dropBomb(): void {
    if (!this.levelController.shouldDropBomb) {
      return;
    }

    const newBomb = new Bomb(this);
    newBomb.create(this.prisoner.sprite.x, this.prisoner.sprite.y);

    newBomb.boundaryCollider = this.physics.add.overlap(
      newBomb.sprite,
      this.bombBoundary,
      this.handleBombBoundaryOverlap,
      null,
      this,
    );

    newBomb.playerCollider = this.physics.add.overlap(
      newBomb.sprite,
      this.player.spriteGroup,
      this.handleBombPlayerOverlap,
      null,
      this,
    );

    this.bombs.push(newBomb);
    this.levelController.addBombDropped();
  }

  private handleBombBoundaryOverlap(): void {
    this.bombs.forEach(bomb => this.destroyBomb(bomb.sprite));

    this.pausePrisoner();
    this.player.removeLife();

    if (!this.player.isAlive) {
      this.pauseTimer.destroy();
    }
  }

  private handleBombPlayerOverlap(bombSprite: Phaser.Physics.Arcade.Sprite): void {
    this.destroyBomb(bombSprite);

    this.levelController.addBombCatched();

    if (this.prisoner.speedLevel < this.levelController.currentLevel) {
      this.prisoner.riseSpeedLevel();
    }
  }

  public pausePrisoner(): void {
    this.dropTimer.paused = true;
    this.prisoner.stopMovement();

    this.pauseTimer = this.time.addEvent({
      callback: this.unpausePrisoner,
      callbackScope: this,
      delay: GameScene.GAME_PAUSE_DELAY,
    });
  }

  public preload(): void {
    Bomb.preload(this);
    Player.preload(this);
    Prisoner.preload(this);
  }

  private unpausePrisoner(): void {
    this.pauseTimer.destroy();
    this.prisoner.startMovement();
    this.dropTimer.paused = false;
  }

  public update(): void {
    this.prisoner.update();
    this.player.update();
  }
}
