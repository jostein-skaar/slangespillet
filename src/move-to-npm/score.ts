export class Score {
  storeKey: string;
  level: number;
  currentScore = 0;
  highScore = 0;
  updateScoreText: () => void;

  constructor(baseKey: string, level: number, updateScoreTextFn: (score: Score) => void) {
    this.storeKey = `${baseKey}-${level}`;
    this.level = level;
    this.highScore = this.getHighScore();
    this.updateScoreText = () => updateScoreTextFn(this);
    this.updateScoreText();
  }

  private getHighScore() {
    const tempBestScore = localStorage.getItem(this.storeKey);
    const bestScore = tempBestScore === null ? 0 : +tempBestScore;
    return bestScore;
  }

  updateHighScore(score: number) {
    const currentHighScore = this.getHighScore();
    this.highScore = Math.max(score, currentHighScore);
    localStorage.setItem(this.storeKey, this.highScore.toString());
  }

  update(value: number) {
    this.currentScore += value;
    this.updateScoreText();
  }

  reset() {
    this.currentScore = 0;
    this.updateScoreText();
  }
}
