import Phaser from 'phaser';
import { defineSystem, defineQuery, IWorld } from 'bitecs';
import { PlayerComponent, InputComponent } from '../components';

export function createPlayerSystem(scene: Phaser.Scene) {
  const playerQuery = defineQuery([PlayerComponent, InputComponent]);
  const maxJumpingTime = 500;

  return defineSystem((world: IWorld) => {
    const entities = playerQuery(world);
    const delta = scene.game.loop.delta;
    const tryingToJump = scene.input.activePointer.isDown;

    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];

      // console.log('info', PlayerComponent.jumpTime[eid]);
      if (tryingToJump && PlayerComponent.isOnGround[eid] === 1) {
        PlayerComponent.jumpTime[eid] = delta;
      } else if (tryingToJump && PlayerComponent.jumpTime[eid] > 0 && PlayerComponent.jumpTime[eid] < maxJumpingTime) {
        PlayerComponent.jumpTime[eid] += delta;
      } else {
        PlayerComponent.jumpTime[eid] = 0;
      }

      InputComponent.isJumping[eid] = PlayerComponent.jumpTime[eid] > 0 ? 1 : 0;
    }

    return world;
  });
}
