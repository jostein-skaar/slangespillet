import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { createWorld, IWorld, System } from 'bitecs';
import Phaser from 'phaser';
import { createCountdown } from './countdown';
import { GameState } from './game';
import { createHero, initHero, updateHeroAnimations as updateHeroAnimations } from './hero';
import { createHighscore, Score } from './highscore';
import { preload } from './preload';
import { resetPresents } from './presents';
import { createScoreText, loseGame, Position, startGame } from './slangespillet';
import { createMovementSystem } from './systems/movement-system';
import { createPlayerSystem } from './systems/player-system';
import { createSpriteInfoSystem, createSpriteSystem } from './systems/sprite-system';

export class MainScene extends Phaser.Scene {
  playerName!: string;
  world!: IWorld;
  playerSystem!: System;
  movementSystem!: System;
  heroSpriteSystem!: System;
  spriteInfoSystem!: System;
  score!: Score;
  gameState: GameState = { isDead: false, isPaused: false };

  groundLayer: any;
  map!: Phaser.Tilemaps.Tilemap;
  hero!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  presentsGroup!: Phaser.Physics.Arcade.Group;
  enemyGroup!: Phaser.Physics.Arcade.Group;

  startGameFn!: () => void;

  constructor() {
    super('main-scene');
  }

  init(data: any): void {
    this.playerName = data.playerName;
    this.score = createHighscore('slangespillet-best-score', 1);
  }

  preload(): void {
    this.load.on('complete', () => {
      console.log('complete');
    });

    preload(this);
  }

  create(): void {
    const tilesSize = adjustForPixelRatio(32);

    this.world = createWorld();
    this.playerSystem = createPlayerSystem(this);
    this.movementSystem = createMovementSystem();
    const heroGroup = this.physics.add.group();
    this.heroSpriteSystem = createSpriteSystem(heroGroup, ['hero-001.png']);
    //this.enemySpriteSystem = createSpriteSystem(enemyGroup, ['enemy-001.png']);
    this.spriteInfoSystem = createSpriteInfoSystem();

    const startPositionHero: Position = {
      x: adjustForPixelRatio(70) / 2 + adjustForPixelRatio(3000),
      y: this.scale.height - adjustForPixelRatio(55) / 2 - tilesSize,
    };

    createHero(this.world, startPositionHero);

    this.heroSpriteSystem(this.world);

    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('tiles', 'tiles');

    console.log('this.map.widthInPixels', this.map.widthInPixels);

    const platformLayer = this.map.createLayer(`level${this.score.level}`, [tiles]);
    platformLayer.setCollisionByProperty({ ground: true });

    this.enemyGroup = this.physics.add.group({
      allowGravity: false,
      // immovable: true,
    });

    this.presentsGroup = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.hero = heroGroup.getFirstAlive();
    initHero(this.hero);

    this.startGameFn = () => {
      this.hero.setPosition(startPositionHero.x, startPositionHero.y);
      resetPresents(this.presentsGroup, this.map, platformLayer);
      startGame(this, this.gameState, this.score);
    };

    this.cameras.main.startFollow(this.hero);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.physics.add.collider(this.hero, platformLayer);
    this.physics.add.collider(heroGroup, platformLayer);

    this.physics.add.overlap(heroGroup, this.presentsGroup, (_helt, present: any) => {
      present.disableBody(true, true);
      this.score.currentScore += 1;
      this.score.updateScoreText();
    });

    this.physics.add.overlap(heroGroup, this.enemyGroup, (_helt, _enemy) => {
      loseGame(this, this.gameState, this.score, this.startGameFn);
    });

    this.gameState.isPaused = true;
    this.physics.pause();
    createCountdown(this, 3, '#0653c7', this.startGameFn);
    createScoreText(this, this.score);
  }

  update(): void {
    this.playerSystem(this.world);
    this.movementSystem(this.world);
    this.heroSpriteSystem(this.world);
    this.spriteInfoSystem(this.world);

    updateHeroAnimations(this.gameState, this.hero);

    if (this.hero.x > this.map.widthInPixels || this.hero.y > this.map.heightInPixels) {
      loseGame(this, this.gameState, this.score, this.startGameFn);
    }
  }
}
