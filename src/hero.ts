import { addComponent, addEntity, IWorld } from 'bitecs';
import { PlayerComponent, PositionComponent, VelocityComponent, SpriteComponent, InputComponent } from './components';
import { GameState } from './game';
import { Position } from './slangespillet';

export function createHero(world: IWorld, position: Position) {
  const heroEntity = addEntity(world);
  addComponent(world, PlayerComponent, heroEntity);
  addComponent(world, PositionComponent, heroEntity);
  addComponent(world, VelocityComponent, heroEntity);
  addComponent(world, SpriteComponent, heroEntity);
  addComponent(world, InputComponent, heroEntity);

  SpriteComponent.texture[heroEntity] = 0;
  PositionComponent.x[heroEntity] = position.x;
  PositionComponent.y[heroEntity] = position.y;
}

export function initHero(hero: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
  hero.anims.create({
    key: 'stand',
    frames: [{ key: 'sprites', frame: 'hero-001.png' }],
    frameRate: 6,
  });
  hero.anims.create({
    key: 'walk',
    frames: [
      { key: 'sprites', frame: 'hero-001.png' },
      { key: 'sprites', frame: 'hero-002.png' },
    ],
    frameRate: 6,
  });
  hero.anims.create({
    key: 'jump',
    frames: [{ key: 'sprites', frame: 'hero-003.png' }],
    frameRate: 6,
  });
}

export function updateHeroAnimations(gameState: GameState, hero: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
  if (gameState.isPaused) {
    return;
  }
  if (gameState.isDead) {
    hero.setTint(0xff0000);
    hero.play('stand', true);
    return;
  }
  hero.setTint(undefined);
  if (hero.body.onFloor() && !hero.body.onWall()) {
    hero.play('walk', true);
  } else if (!hero.body.onFloor()) {
    hero.play('jump', true);
  } else {
    hero.play('stand', true);
  }
}
