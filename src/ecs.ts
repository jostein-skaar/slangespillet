import { createWorld, IWorld, System } from 'bitecs';
import { createMovementSystem } from './systems/movement-system';
import { createPlayerSystem } from './systems/player-system';
import { createSpriteInfoSystem, createSpriteSystem } from './systems/sprite-system';

export class Ecs {
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  scene: Phaser.Scene;
  world!: IWorld;
  playerSystem!: System;
  movementSystem!: System;
  heroSpriteSystem!: System;
  spriteInfoSystem!: System;
  heroGroup!: Phaser.Physics.Arcade.Group;

  create(): void {
    this.heroGroup = this.scene.physics.add.group();

    this.world = createWorld();
    this.playerSystem = createPlayerSystem(this.scene);
    this.movementSystem = createMovementSystem();

    this.heroSpriteSystem = createSpriteSystem(this.heroGroup, ['hero-001.png']);
    //this.enemySpriteSystem = createSpriteSystem(enemyGroup, ['enemy-001.png']);
    this.spriteInfoSystem = createSpriteInfoSystem();
  }

  update() {
    this.playerSystem(this.world);
    this.movementSystem(this.world);
    this.heroSpriteSystem(this.world);
    this.spriteInfoSystem(this.world);
  }
}
