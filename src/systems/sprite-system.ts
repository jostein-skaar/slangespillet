import Phaser from 'phaser';
import { defineSystem, defineQuery, enterQuery, exitQuery } from 'bitecs';
import { PlayerComponent, PositionComponent, SpriteComponent, VelocityComponent } from '../components';

const spritesById = new Map<number, Phaser.Physics.Arcade.Sprite>();

export function createSpriteSystem(group: Phaser.Physics.Arcade.Group, textures: string[]) {
  const spriteQuery = defineQuery([PositionComponent, VelocityComponent, SpriteComponent]);

  const spriteQueryEnter = enterQuery(spriteQuery);
  const spriteQueryExit = exitQuery(spriteQuery);

  return defineSystem((world) => {
    const entitiesEntered = spriteQueryEnter(world);
    for (let i = 0; i < entitiesEntered.length; i++) {
      const eid = entitiesEntered[i];
      const textureId = SpriteComponent.texture[eid];
      const texture = textures[textureId];

      console.log('entitiesEntered', eid, PositionComponent.x[eid], PositionComponent.y[eid]);

      const sprite = group.get(PositionComponent.x[eid], PositionComponent.y[eid], 'sprites', texture);
      spritesById.set(eid, sprite);
    }

    const entities = spriteQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];

      const sprite = spritesById.get(eid)!;

      if (VelocityComponent.shouldUpdateX[eid] === 1) {
        sprite.setVelocityX(VelocityComponent.x[eid]);
      }

      if (VelocityComponent.shouldUpdateY[eid] === 1) {
        sprite.setVelocityY(VelocityComponent.y[eid]);
      }
    }

    const entitiesExited = spriteQueryExit(world);
    for (let i = 0; i < entitiesExited.length; i++) {
      const eid = entitiesEntered[i];
      const sprite = spritesById.get(eid)!;
      group.killAndHide(sprite);
      spritesById.delete(eid);
      console.log('entitiesExited', eid);
    }

    return world;
  });
}

export function createSpriteInfoSystem() {
  const spriteQuery = defineQuery([PositionComponent, VelocityComponent, SpriteComponent, PlayerComponent]);

  return defineSystem((world) => {
    const entities = spriteQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];

      const sprite = spritesById.get(eid)! as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

      PlayerComponent.isOnGround[eid] = +sprite.body.onFloor();
      PlayerComponent.isMoving[eid] = +!sprite.body.onWall();
      if (!sprite.body.onFloor()) {
        // console.log('in the air');
      }
    }

    return world;
  });
}
