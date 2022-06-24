export function createHighscore(baseKey: string, level: number): Score {
  const storeKey = `${baseKey}-${level}`;

  const getHighScore = () => {
    const tempBestScore = localStorage.getItem(storeKey);
    const bestScore = tempBestScore === null ? 0 : +tempBestScore;
    return bestScore;
  };

  const updateHighScore = (score: number) => {
    const currentBestScore = getHighScore();
    const bestScore = Math.max(score, currentBestScore);
    localStorage.setItem(storeKey, bestScore.toString());
  };

  const bestScore = getHighScore();

  const score: Score = {
    level,
    currentScore: 0,
    bestScore,
    getHighScore,
    updateHighScore,
    updateScoreText: () => {
      console.warn('Missing updateScoreText()');
    },
    reset: () => {
      score.currentScore = 0;
    },
  };

  return score;
}

export interface Score {
  level: number;
  currentScore: number;
  bestScore: number;
  getHighScore: () => number;
  updateHighScore: (score: number) => void;
  updateScoreText: () => void;
  reset: () => void;
}
