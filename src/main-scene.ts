import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import Phaser from 'phaser';
import { createCountdown } from './move-to-npm/countdown';
import { Hero } from './hero';
import { Score } from './move-to-npm/score';
import { Level } from './level';
import { preload } from './preload';
import { createScoreText, loseGame } from './slangespillet';
import { Position } from './move-to-npm/position';
import { Icon } from './move-to-npm/icon';

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
    this.score = new Score('slangespillet-best-score', 1, createScoreText(this));

    const startPositionInLevel: Position = {
      x: adjustForPixelRatio(50 + 2700 + -2700),
      y: this.scale.height - adjustForPixelRatio(32),
    };

    this.map = this.make.tilemap({ key: 'map' });
    this.map.addTilesetImage('tiles', 'tiles');

    this.hero = new Hero(this, startPositionInLevel);
    this.hero.sprite.setDepth(1);

    this.level = new Level(this, this.map, 1, this.hero);

    // const hero = new Hero(adjustForPixelRatio(70), adjustForPixelRatio(55), startPositionInLevel);

    this.physics.add.collider(this.hero.sprite, this.level.platformLayer);
    this.physics.add.collider(this.level.enemyGroup, this.level.platformLayer);

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

    this.physics.add.overlap(this.hero.sprite, this.level.enemyGroup, (_helt, _enemy: any) => {
      console.log('Au au');
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
      // this.physics.pause();
    });

    new Icon(this, 'pause', adjustForPixelRatio(8), adjustForPixelRatio(8), 0x0066ff, 0xe7f5ff, () => {
      if (this.physics.world.isPaused) {
        this.physics.resume();
        this.anims.resumeAll();
      } else {
        this.physics.pause();
        this.anims.pauseAll();
      }
    });

    // new Icon(this, 'gear', adjustForPixelRatio(8 + 8 + 32), adjustForPixelRatio(8), 0x0066ff, 0x00ffff, () => {
    //   console.log('Settings');
    // });
  }

  enemyDirection = 1;

  update(_time: number, delta: number): void {
    this.hero.update(delta);

    // this.enemy01.setVelocityX(this.enemyDirection * 40);

    // if (this.enemyDirection === 1 && this.enemy01.x > this.hero.sprite.x + 500) {
    //   this.enemyDirection = -1;
    //   this.enemy01.flipX = true;
    // } else if (this.enemyDirection === -1 && this.enemy01.x < this.hero.sprite.x) {
    //   this.enemyDirection = 1;
    //   this.enemy01.flipX = false;
    // }

    if (this.hero.sprite.x > this.map.widthInPixels || this.hero.sprite.y > this.map.heightInPixels) {
      this.hero.isDead = true;
      loseGame(this, this.score, () => {
        this.restartGameFn();
      });
    }
  }
}
