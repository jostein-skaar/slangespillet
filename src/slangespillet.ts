import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { Score } from './move-to-npm/score';

let textElement: Phaser.GameObjects.Text;

export function loseGame(scene: Phaser.Scene, score: Score, startGameFn: () => void) {
  if (scene.physics.world.isPaused) {
    return;
  }

  const reset = () => {
    scene.cameras.main.setBackgroundColor();
    textElement.setVisible(false);
  };

  scene.physics.pause();

  scene.cameras.main.setBackgroundColor(0xbababa);

  console.log({ currentScore: score.currentScore, level: score.level });
  score.updateHighScore(score.currentScore);
  //   this.scene.launch('lost-scene', { score: this.score });

  const text = `Du klarte ${score.currentScore}\nTrykk for å prøve igjen\n(Vent for å gå til meny)`;
  if (textElement === undefined) {
    textElement = scene.add
      .text(scene.scale.width / 2, scene.scale.height / 2, text, {
        fontFamily: 'arial',
        fontSize: `${adjustForPixelRatio(20)}px`,
        color: '#fff',
        align: 'center',
        backgroundColor: '#0653c7',
        padding: { x: adjustForPixelRatio(15), y: adjustForPixelRatio(15) },
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0);
  } else {
    textElement.setText(text);
    textElement.setVisible(true);
  }

  const resetAndStartFn = () => {
    scene.input.off('pointerdown', resetAndStartFn);
    clearTimeout(goToHomeTimeout);
    console.log('Start again');
    // startGame(scene, gameState, score);
    reset();
    startGameFn();
  };

  // const goToHomeFn = () => {
  //   scene.input.off('pointerdown', resetAndStartFn);
  //   console.log('Go to home');
  //   // TODO: Goto home screen
  //   // this.scene.stop();
  //   // const home = document.querySelector<HTMLDivElement>('#home')!;
  //   // const game = document.querySelector<HTMLDivElement>('#game')!;
  //   // home.style.display = 'block';
  //   // game.style.display = 'none';
  // };

  const goToHomeTimeout = setTimeout(resetAndStartFn, 5000);

  setTimeout(() => {
    scene.input.once('pointerdown', resetAndStartFn);
  }, 500);
}

export function createScoreText(scene: Phaser.Scene): (score: Score) => void {
  const getText = (score: Score) => {
    let text = `Level ${score.level}`;
    text += `\nPakker: ${score.currentScore}`;
    if (score.highScore > 0) {
      text += `\nRekord: ${score.highScore}`;
    }
    return text;
  };

  const textElement = scene.add.text(adjustForPixelRatio(450), adjustForPixelRatio(16), '', {
    fontSize: `${adjustForPixelRatio(24)}px`,
    color: '#000',
    backgroundColor: '#ccc',
    padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
  });
  textElement.setScrollFactor(0, 0);

  const updateScoreText = (score: Score) => {
    textElement.setText(getText(score));
  };

  return updateScoreText;
}
