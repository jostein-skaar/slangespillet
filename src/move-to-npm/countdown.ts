// TODO: Countdown functionality. Get from common?

import { adjustForPixelRatio } from '@jostein-skaar/common-game';

export function createCountdown(scene: Phaser.Scene, count: number, color: string, countdownFinishedCallback: () => void) {
  scene.physics.pause();
  scene.anims.pauseAll();
  const countdownFinished = () => {
    scene.physics.resume();
    scene.anims.resumeAll();
    countdownFinishedCallback();
  };
  const countdownText = scene.add
    .text(scene.scale.width / 2, scene.scale.height / 2, '', {
      fontSize: `${adjustForPixelRatio(200)}px`,
      color,
      fontStyle: 'bold',
    })
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0, 0);

  scene.tweens.add({
    targets: countdownText,
    // x: this.bredde,
    scale: 1.4,
    ease: 'Power0',
    duration: 250,
    yoyo: true,
    repeat: -1,
  });

  if (count === 0) {
    countdownFinished();
    return;
  }

  countdownText.setText(count.toString());
  const countdownIntervalId = setInterval(() => {
    count--;
    countdownText.setText(count.toString());
    console.log(count);
    if (count <= 0) {
      countdownText.setVisible(false);
      clearInterval(countdownIntervalId);
      countdownFinished();
    }
  }, 1000);
}
