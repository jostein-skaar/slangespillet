import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import Phaser from 'phaser';
import { createCountdown } from './move-to-npm/countdown';
import { Hero } from './hero';
import { Score } from './move-to-npm/score';
import { createLevel } from './level';
import { preload } from './preload';
import { createScoreText, loseGame } from './slangespillet';
import { Position } from './move-to-npm/position';

export class MainScene extends Phaser.Scene {
  map!: Phaser.Tilemaps.Tilemap;
  hero!: Hero;
  score!: Score;
  restartGameFn!: () => void;

  constructor() {
    super('main-scene');
  }

  preload(): void {
    this.load.on('complete', () => {
      console.log('complete');
    });

    preload(this);
  }

  create(): void {
    this.score = new Score('slangespillet-best-score', 1, createScoreText(this));

    const startPositionInLevel: Position = {
      x: adjustForPixelRatio(50 + 2700 + -2700),
      y: this.scale.height - adjustForPixelRatio(32),
    };

    this.map = this.make.tilemap({ key: 'map' });
    this.map.addTilesetImage('tiles', 'tiles');

    const presentGroup = this.physics.add.group({ allowGravity: false, immovable: true });
    const enemyGroup = this.physics.add.group();

    const platformLayer = createLevel(this.map, 1, presentGroup, enemyGroup);

    // const hero = new Hero(adjustForPixelRatio(70), adjustForPixelRatio(55), startPositionInLevel);
    this.hero = new Hero(this, startPositionInLevel);

    this.physics.add.collider(this.hero.sprite, platformLayer);

    this.physics.add.overlap(this.hero.sprite, presentGroup, (_helt, present: any) => {
      present.disableBody(true, true);
      this.score.update(+1);
    });

    this.cameras.main.startFollow(this.hero.sprite);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.restartGameFn = () => {
      this.hero.reset();
      this.score.reset();
      createLevel(this.map, 1, presentGroup, enemyGroup);
      this.physics.resume();
    };

    createCountdown(this, 1, '#0653c7', () => {
      console.log('Start game');
    });
  }

  update(): void {
    this.hero.update();

    if (this.hero.sprite.x > this.map.widthInPixels || this.hero.sprite.y > this.map.heightInPixels) {
      this.hero.isDead = true;
      loseGame(this, this.score, () => {
        this.restartGameFn();
      });
    }
  }
}
