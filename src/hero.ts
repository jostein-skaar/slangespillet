import { addComponent, addEntity, IWorld } from 'bitecs';
import { PlayerComponent, PositionComponent, VelocityComponent, SpriteComponent, InputComponent } from './components';
import { Ecs } from './ecs';
import { Position } from './slangespillet';

export class Hero {
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  width: number;
  height: number;
  startPosition: Position;
  isDead = false;

  constructor(ecs: Ecs, width: number, height: number, startPositionInLevel: Position) {
    this.width = width;
    this.height = height;
    this.startPosition = { x: startPositionInLevel.x + this.width / 2, y: startPositionInLevel.y - this.height / 2 };

    this.createEntity(ecs.world);
    ecs.heroSpriteSystem(ecs.world);
    this.sprite = ecs.heroGroup.getFirstAlive();
    this.createAnimations();
  }

  reset() {
    this.isDead = false;
    this.sprite.setPosition(this.startPosition.x, this.startPosition.y);
  }

  private createAnimations() {
    this.sprite.anims.create({
      key: 'stand',
      frames: [{ key: 'sprites', frame: 'hero-001.png' }],
      frameRate: 6,
    });
    this.sprite.anims.create({
      key: 'walk',
      frames: [
        { key: 'sprites', frame: 'hero-001.png' },
        { key: 'sprites', frame: 'hero-002.png' },
      ],
      frameRate: 6,
    });
    this.sprite.anims.create({
      key: 'jump',
      frames: [{ key: 'sprites', frame: 'hero-003.png' }],
      frameRate: 6,
    });
  }

  updateAnimations(isPaused: boolean) {
    if (this.isDead) {
      this.sprite.setTint(0xff0000);
      this.sprite.play('stand', true);
      return;
    }
    this.sprite.setTint(undefined);
    if (isPaused) {
      return;
    }
    if (this.sprite.body.onFloor() && !this.sprite.body.onWall()) {
      this.sprite.play('walk', true);
    } else if (!this.sprite.body.onFloor()) {
      this.sprite.play('jump', true);
    } else {
      this.sprite.play('stand', true);
    }
  }

  private createEntity(world: IWorld) {
    const heroEntity = addEntity(world);
    addComponent(world, PlayerComponent, heroEntity);
    addComponent(world, PositionComponent, heroEntity);
    addComponent(world, VelocityComponent, heroEntity);
    addComponent(world, SpriteComponent, heroEntity);
    addComponent(world, InputComponent, heroEntity);

    SpriteComponent.texture[heroEntity] = 0;
    PositionComponent.x[heroEntity] = this.startPosition.x;
    PositionComponent.y[heroEntity] = this.startPosition.y;
  }
}
