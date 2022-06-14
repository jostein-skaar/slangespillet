import Phaser from 'phaser';
import { defineSystem, defineQuery, IWorld } from 'bitecs';
import { PlayerComponent, InputComponent } from '../components';

export function createPlayerSystem(scene: Phaser.Scene) {
  const playerQuery = defineQuery([PlayerComponent, InputComponent]);
  const maxJumpingTime = 500;

  return defineSystem((world: IWorld) => {
    const entities = playerQuery(world);
    const delta = scene.game.loop.delta;

    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];

      const canStartJump = PlayerComponent.isOnGround[eid] === 1;
      const startedToJump = PlayerComponent.wantingToJumpTime[eid] > 0;
      const tryingToJump = scene.input.activePointer.isDown;

      // console.log('info', PointerInput.wantingToJumpTime[eid], canStartJump);

      if (canStartJump && tryingToJump && !startedToJump) {
        PlayerComponent.wantingToJumpTime[eid] = 1;
      }

      if (startedToJump && !tryingToJump) {
        PlayerComponent.wantingToJumpTime[eid] = 0;
      }

      if (startedToJump && tryingToJump) {
        if (PlayerComponent.wantingToJumpTime[eid] < maxJumpingTime) {
          PlayerComponent.wantingToJumpTime[eid] += delta;
        } else {
          PlayerComponent.wantingToJumpTime[eid] = 0;
        }
      }

      InputComponent.isJumping[eid] = PlayerComponent.wantingToJumpTime[eid] > 0 ? 1 : 0;

      // if (startedToJump && !scene.input.activePointer.isDown) {
      //   console.log('Should fall down soon now.');
      //   PointerInput.wantingToJumpTime[eid] = 0;
      // }

      // if (scene.input.activePointer.isDown) {
      //   if (canStartJump && !startedToJump) {
      //     PointerInput.wantingToJumpTime[eid] += delta;
      //   }

      //   if (PointerInput.wantingToJumpTime[eid] < 500) {
      //     PointerInput.wantingToJumpTime[eid] += delta;
      //   }
      // } else {
      //   PointerInput.wantingToJumpTime[eid] = 0;
      // }

      // PointerInput.isPointerDown[eid] = +hasPointerDownEvent * ;
    }

    return world;
  });
}
