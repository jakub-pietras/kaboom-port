import * as Phaser from 'phaser';

import {Bomb} from '@app/objects/Bomb';
import {Player} from '@app/objects/Player';
import {Prisoner} from '@app/objects/Prisoner';

import * as bombCatch from './sfx/bombCatch.wav';
import * as bombFuse from './sfx/bombFuse.wav';
import {LevelController} from './LevelController';

export class GameScene extends Phaser.Scene {
  private static readonly BOMB_DROP_DELAY = 250;
  private static readonly GAME_PAUSE_DELAY = 2000;
  private static readonly SCENE_KEY = 'GameScene';

  private background: Phaser.GameObjects.Graphics;
  private bombBoundary: Phaser.Physics.Arcade.Sprite;
  private bombs: Array<Bomb> = [];
  private dropTimer: Phaser.Time.TimerEvent;
  private fuseSound: Phaser.Sound.BaseSound;
  private levelController = new LevelController();
  private pauseTimer: Phaser.Time.TimerEvent;
  private player: Player;
  private prisoner: Prisoner;
  private scoreText: Phaser.GameObjects.Text;

  constructor() {
    super(GameScene.SCENE_KEY);

    this.player = new Player(this);
    this.prisoner = new Prisoner(this);
  }

  public create(): void {
    const worldHeight = this.game.scale.height;
    const worldWidth = this.game.scale.width;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.fuseSound = this.sound.add('bombFuse');

    this.bombBoundary = this.physics.add.sprite(worldWidth / 2, worldHeight, null);
    this.bombBoundary.setOrigin(0.5, 1);
    this.bombBoundary.body.setSize(worldWidth, 1);
    this.bombBoundary.setAlpha(0);

    this.background = this.add.graphics();
    this.background.fillStyle(0x527e2d);
    this.background.fillRect(0, worldHeight * 0.2, worldWidth, worldHeight * 0.8);

    this.prisoner.create(worldWidth * 0.8, worldHeight * 0.2);
    this.player.create(worldWidth * 0.5, worldHeight * 0.95);

    this.scoreText = this.add.text(worldWidth * 0.5, worldHeight * 0.01, '0', {
      color: '#ced059',
      fontSize: 42,
    });

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
      this.pausePrisoner();
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

    newBomb.playerBottomPaddleCollider = this.physics.add.overlap(
      newBomb.sprite,
      this.player.paddleSprites.bottom,
      this.handleBombPlayerOverlap,
      null,
      this,
    );

    newBomb.playerMiddlePaddleCollider = this.physics.add.overlap(
      newBomb.sprite,
      this.player.paddleSprites.middle,
      this.handleBombPlayerOverlap,
      null,
      this,
    );

    newBomb.playerTopPaddleCollider = this.physics.add.overlap(
      newBomb.sprite,
      this.player.paddleSprites.top,
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
    this.levelController.resetDroppedBombs();

    if (!this.player.isAlive) {
      this.pauseTimer.destroy();
    }
  }

  private handleBombPlayerOverlap(
    bombSprite: Phaser.Physics.Arcade.Sprite,
    playerPaddle: Phaser.Physics.Arcade.Sprite,
  ): void {
    this.destroyBomb(bombSprite);

    const previousScoreThousands = Math.floor(this.levelController.currentScore / 1000);

    this.sound.play('bombCatch');
    this.player.animateSplash(playerPaddle);
    this.levelController.addBombCatched();
    this.scoreText.setText(this.levelController.currentScore.toString());

    const currentScoreThousands = Math.floor(this.levelController.currentScore / 1000);

    if (currentScoreThousands > previousScoreThousands) {
      this.player.addLife();
    }

    if (this.prisoner.speedLevel < this.levelController.currentLevel) {
      this.prisoner.riseSpeedLevel();
    }
  }

  public pausePrisoner(): void {
    this.dropTimer.paused = true;
    this.prisoner.stopMovement();

    if (this.pauseTimer) {
      this.pauseTimer.destroy();
    }

    this.pauseTimer = this.time.addEvent({
      callback: this.unpausePrisoner,
      callbackScope: this,
      delay: GameScene.GAME_PAUSE_DELAY,
    });
  }

  public preload(): void {
    this.load.audio('bombCatch', bombCatch);
    this.load.audio('bombFuse', bombFuse);

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
    if (this.bombs.length > 0) {
      if (!this.fuseSound.isPlaying) {
        this.fuseSound.play();
      }
    } else if (this.fuseSound.isPlaying) {
      this.fuseSound.stop();
    }

    this.prisoner.update();
    this.player.update();
  }
}
