export class LevelController {
  private static readonly MAX_LEVEL = 8;
  private bombsCatched = 0;
  private bombsDropped = 0;
  private level = 1;
  private score = 0;

  public get currentLevel(): number {
    return this.level;
  }

  private get currentLevelBombLimit(): number {
    return this.level * 10;
  }

  public get currentScore(): number {
    return this.score;
  }

  public get shouldDropBomb(): boolean {
    return this.bombsDropped < this.currentLevelBombLimit;
  }

  public addBombCatched(): void {
    this.bombsCatched++;
    this.score += this.level;

    if (this.bombsCatched === this.currentLevelBombLimit) {
      this.increaseLevel();
    }
  }

  public addBombDropped(): void {
    this.bombsDropped++;
  }

  private increaseLevel(): void {
    this.bombsDropped = 0;
    this.bombsCatched = 0;

    if (this.level < LevelController.MAX_LEVEL) {
      this.level++;
    }
  }
}
