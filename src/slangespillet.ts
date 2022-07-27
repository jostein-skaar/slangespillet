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
    scene.physics.resume();
    scene.anims.resumeAll();
  };

  scene.physics.pause();
  scene.anims.pauseAll();

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
  let hasChangedFontSize = false;
  const getText = (score: Score) => {
    return `${score.currentScore}`;
  };

  const presentSprite = scene.add
    .sprite(scene.scale.width - adjustForPixelRatio(8 + 12), adjustForPixelRatio(8 + 12), 'sprites', 'ui-present-001.png')
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5);

  const textElement = scene.add
    .text(presentSprite.x, presentSprite.y + adjustForPixelRatio(3), '', {
      fontSize: `${adjustForPixelRatio(15)}px`,
      color: '#fff',
      stroke: '#000',
      fontStyle: 'bold',
      strokeThickness: adjustForPixelRatio(2),
      fixedWidth: adjustForPixelRatio(24),
      align: 'center',

      // backgroundColor: '#000',
      // padding: { top: adjustForPixelRatio(10) },
    })
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0, 0);

  const updateScoreText = (score: Score) => {
    if (!hasChangedFontSize && score.currentScore > 99) {
      console.log('Minske skrift', textElement.style.fontSize);
      textElement.setFontSize(adjustForPixelRatio(10));
      // textElement.setPadding({ top: adjustForPixelRatio(12) });
      hasChangedFontSize = true;
    }
    textElement.setText(getText(score));
    pointTween.play();
  };

  const pointTween = scene.tweens.add({
    targets: textElement,
    scale: 1.3,
    ease: 'Power0',
    duration: 100,
    yoyo: true,
    repeat: 0,
  });

  return updateScoreText;
}
