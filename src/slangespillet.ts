import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { GameState } from './game';
import { Score } from './highscore';

let textElement: Phaser.GameObjects.Text;

export function startGame(scene: Phaser.Scene, gameState: GameState, score: Score) {
  if (textElement !== undefined) {
    textElement.setVisible(false);
  }

  // hero
  // enemies
  // presents

  score.currentScore = 0;
  gameState.isDead = false;
  gameState.isPaused = false;
  scene.physics.resume();
}

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

  const goToHomeTimeout = setTimeout(() => {
    // Temp: start automatic
    reset();
    startGameFn();
    // TODO: Goto home screen
    // this.scene.stop();
    // const home = document.querySelector<HTMLDivElement>('#home')!;
    // const game = document.querySelector<HTMLDivElement>('#game')!;
    // home.style.display = 'block';
    // game.style.display = 'none';
  }, 5000);

  setTimeout(() => {
    scene.input.once('pointerdown', () => {
      clearTimeout(goToHomeTimeout);
      console.log('Start again');
      // startGame(scene, gameState, score);
      reset();
      startGameFn();
    });
  }, 500);
}

export function createScoreText(scene: Phaser.Scene, score: Score): void {
  const text = getText(score);
  const textElement = scene.add.text(adjustForPixelRatio(16), adjustForPixelRatio(16), text, {
    fontSize: `${adjustForPixelRatio(24)}px`,
    color: '#000',
    backgroundColor: '#ccc',
    padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
  });
  textElement.setScrollFactor(0, 0);

  score.updateScoreText = () => {
    textElement.setText(getText(score));
  };
}

function getText(score: Score) {
  let text = `Level ${score.level}`;
  text += `\nPakker: ${score.currentScore}`;
  if (score.bestScore > 0) {
    text += `\nRekord: ${score.bestScore}`;
  }
  return text;
}

export interface Position {
  x: number;
  y: number;
}
