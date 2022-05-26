import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'preload-scene' });
  }

  preload() {
    console.log('preload-scene');

    this.load.multiatlas('sprites', `/assets/sprites@${adjustForPixelRatio(1)}.json?v={VERSJON}`, '/assets');

    this.load.spritesheet('present', `/assets/presents@${adjustForPixelRatio(1)}.png?v={VERSJON}`, {
      frameWidth: adjustForPixelRatio(32),
      frameHeight: adjustForPixelRatio(32),
      margin: adjustForPixelRatio(1),
      spacing: adjustForPixelRatio(2),
    });

    this.load.image('tiles', `/assets/tiles@${adjustForPixelRatio(1)}.png?v={VERSJON}`);
    this.load.image('presents', `/assets/presents@${adjustForPixelRatio(1)}.png?v={VERSJON}`);

    this.load.tilemapTiledJSON('map', `assets/levels@${adjustForPixelRatio(1)}.json?v={VERSJON}`);
  }
}
