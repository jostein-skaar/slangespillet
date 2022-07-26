import { adjustForPixelRatio } from '@jostein-skaar/common-game';

export function preload(scene: Phaser.Scene) {
  console.log('preload()');

  scene.load.multiatlas('sprites', `/assets/sprites@${adjustForPixelRatio(1)}.json?v={VERSJON}`, '/assets');

  scene.load.spritesheet('present', `/assets/presents@${adjustForPixelRatio(1)}.png?v={VERSJON}`, {
    frameWidth: adjustForPixelRatio(24),
    frameHeight: adjustForPixelRatio(24),
    margin: adjustForPixelRatio(1),
    spacing: adjustForPixelRatio(2),
  });

  scene.load.image('tiles', `/assets/tiles@${adjustForPixelRatio(1)}.png?v={VERSJON}`);
  scene.load.image('presents', `/assets/presents@${adjustForPixelRatio(1)}.png?v={VERSJON}`);

  scene.load.tilemapTiledJSON('map', `assets/levels@${adjustForPixelRatio(1)}.json?v={VERSJON}`);
}
