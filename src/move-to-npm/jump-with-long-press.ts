import { LadderClimbing } from './climb-ladder';

export function jumpWithLongPress(
  scene: Phaser.Scene,
  spriteWithDynamicBody: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ladderClimbing: LadderClimbing
): () => boolean {
  const maxJumpingTime = 500;

  let jumpTime = 0;

  return () => {
    const delta = scene.game.loop.delta;
    const tryingToJump = scene.input.activePointer.isDown;
    const isOnGround = spriteWithDynamicBody.body.onFloor();
    const isClimbing = ladderClimbing.isClimbing;

    const isOkToJump = isOnGround || isClimbing;

    if (tryingToJump && isOkToJump) {
      jumpTime = delta;
    } else if (tryingToJump && jumpTime > 0 && jumpTime < maxJumpingTime) {
      jumpTime += delta;
    } else {
      jumpTime = 0;
    }

    if (tryingToJump && isClimbing) {
      ladderClimbing.cancel();
    }

    return jumpTime > 0;
  };
}
