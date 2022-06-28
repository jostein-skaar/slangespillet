import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import Phaser from 'phaser';
import { createCountdown } from './move-to-npm/countdown';
import { Hero } from './hero';
import { Score } from './move-to-npm/score';
import { Level } from './level';
import { preload } from './preload';
import { createScoreText, loseGame } from './slangespillet';
import { Position } from './move-to-npm/position';

export class MainScene extends Phaser.Scene {
  map!: Phaser.Tilemaps.Tilemap;
  level!: Level;
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
    console.log('TILE_BIAS', this.physics.world.TILE_BIAS);

    this.score = new Score('slangespillet-best-score', 1, createScoreText(this));

    const startPositionInLevel: Position = {
      x: adjustForPixelRatio(50 + 2700 + -2700),
      y: this.scale.height - adjustForPixelRatio(32),
    };

    this.map = this.make.tilemap({ key: 'map' });
    this.map.addTilesetImage('tiles', 'tiles');

    this.level = new Level(this, this.map, 1);

    // const hero = new Hero(adjustForPixelRatio(70), adjustForPixelRatio(55), startPositionInLevel);
    this.hero = new Hero(this, startPositionInLevel);

    this.physics.add.collider(this.hero.sprite, this.level.platformLayer);

    // this.physics.add.overlap(this.hero.sprite, platformLayer, (_helt, tile: any) => {
    //   if (tile.properties['ladderup'] === true) {
    //     this.hero.climbUpLadder(tile);
    //   } else if (tile.properties['ladderdown'] === true) {
    //     this.hero.climbDownLadder(tile);
    //   }
    // });

    this.physics.add.overlap(this.hero.sprite, this.level.presentGroup, (_helt, present: any) => {
      present.disableBody(true, true);
      this.score.update(+1);
    });

    this.physics.add.overlap(this.hero.sprite, this.level.ladderGroup, (_helt, hitBox: any) => {
      // hitBox.destroy();
      this.hero.climbLadder(hitBox.x, hitBox.y, hitBox.direction);

      // const intervalCheck = setInterval(() => {
      //   if (ladderDirection === -1) {
      //     if (this.hero.sprite.x >= hitBox.x + this.hero.width / 2 - adjustForPixelRatio(50)) {
      //       this.hero.climbLadder(hitBox.x, ladderDirection);
      //       clearInterval(intervalCheck);
      //     }
      //   }
      // }, 10);
    });

    this.cameras.main.startFollow(this.hero.sprite);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.restartGameFn = () => {
      this.hero.reset();
      this.score.reset();
      this.level.reset();
      this.physics.resume();
    };

    createCountdown(this, 1, '#0653c7', () => {
      console.log('Start game');
    });
  }

  update(_time: number, delta: number): void {
    this.hero.update(delta);

    if (this.hero.sprite.x > this.map.widthInPixels || this.hero.sprite.y > this.map.heightInPixels) {
      this.hero.isDead = true;
      loseGame(this, this.score, () => {
        this.restartGameFn();
      });
    }
  }
}
