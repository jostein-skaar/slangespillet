import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import Phaser, { GameObjects } from 'phaser';
import { createCountdown } from './move-to-npm/countdown';
import { Hero } from './hero';
import { Score } from './move-to-npm/score';
import { Level } from './level';
import { preload } from './preload';
import { createScoreText, loseGame } from './slangespillet';
import { Icon } from './move-to-npm/icon';

export class MainScene extends Phaser.Scene {
  map!: Phaser.Tilemaps.Tilemap;
  level!: Level;
  hero!: Hero;
  score!: Score;
  emitter!: GameObjects.Particles.ParticleEmitter;
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
    this.map = this.make.tilemap({ key: 'map' });
    this.map.addTilesetImage('tiles', 'tiles');

    this.hero = new Hero(this);
    this.hero.sprite.setDepth(1);

    this.level = new Level(this, this.map, 1, this.hero);

    this.physics.add.collider(this.hero.sprite, this.level.platformLayer);
    this.physics.add.collider(this.level.enemyGroup, this.level.platformLayer);

    this.score = new Score('slangespillet-best-score', 1, createScoreText(this));

    this.createLifes();

    this.physics.add.overlap(this.hero.sprite, this.level.presentGroup, (_helt, present: any) => {
      this.collectPresent(present);
    });

    this.physics.add.overlap(this.hero.sprite, this.level.ladderGroup, (_helt, hitBox: any) => {
      this.hero.climbLadder(hitBox.x, hitBox.y, hitBox.direction);
    });

    this.cameras.main.startFollow(this.hero.sprite);
    this.cameras.main.setBounds(0, this.map.heightInPixels - this.scale.height, this.map.widthInPixels, this.scale.height);

    this.restartGameFn = () => {
      this.score.reset();
      this.level.reset();
      this.physics.resume();
    };

    createCountdown(this, 2, '#0653c7', () => {
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

    this.emitter = this.add.particles('sprites', 'particle-star-001.png').createEmitter({
      scale: { start: 1, end: 0 },
      speed: { min: 0, max: 200 },
      active: false,
      lifespan: 500,
      quantity: 10,
    });

    // this.events.on('level-finished', () => {
    //   setTimeout(() => {
    //     loseGame(this, this.score, () => {
    //       this.restartGameFn();
    //     });
    //   }, 2000);
    // });
  }

  update(_time: number, delta: number): void {
    this.hero.update(delta);

    if (this.hero.sprite.x - this.hero.width / 2 > this.map.widthInPixels || this.hero.sprite.y > this.map.heightInPixels) {
      this.hero.isDead = true;
      loseGame(this, this.score, () => {
        this.restartGameFn();
      });
    }
  }

  collectPresent(present: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    present.disableBody(true, true);
    this.score.update(+1);
    const presentBounds = present.getBounds();
    this.emitter.setPosition(presentBounds.left, presentBounds.top);
    this.emitter.active = true;
    this.emitter.setEmitZone({
      source: new Phaser.Geom.Rectangle(0, 0, presentBounds.width, presentBounds.height),
      type: 'random',
      quantity: 10,
    });
    this.emitter.explode();
  }

  private createLifes() {
    const lifeSprite1 = this.add.sprite(0, 0, 'sprites', 'ui-life-001.png');
    const lifeSprite2 = this.add.sprite(adjustForPixelRatio(32 + 5), 0, 'sprites', 'ui-life-001.png');
    const lifeSprite3 = this.add.sprite(adjustForPixelRatio(32 + 5) * 2, 0, 'sprites', 'ui-life-001.png');

    // lifeSprite2.setTint(0xaaaaaa);
    // lifeSprite2.setAlpha(0.7);

    const container = new Phaser.GameObjects.Container(this, 0, adjustForPixelRatio(8 + 16), [
      lifeSprite1,
      lifeSprite2,
      lifeSprite3,
    ]).setScrollFactor(0);
    container.setX(this.scale.width / 2 - lifeSprite3.x / 2);
    this.add.existing(container);
  }
}
