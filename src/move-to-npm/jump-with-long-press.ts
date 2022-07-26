import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { LadderClimbing } from './climb-ladder';

export function jumpWithLongPress(
  scene: Phaser.Scene,
  spriteWithDynamicBody: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ladderClimbing: LadderClimbing
): () => boolean {
  const maxJumpingTime = 500;
  const safeMarginTop = adjustForPixelRatio(8 + 24 + 8);
  const noJumpZoneX = adjustForPixelRatio(2400 - 200);
  let jumpTime = 0;

  return () => {
    if (scene.physics.world.isPaused) {
      return false;
    }

    const delta = scene.game.loop.delta;
    // y < 0: Over the canvas if in a browser.
    // y > safeMarginTop: Under the icon bar.
    const tryingToJump =
      scene.input.activePointer.isDown && (scene.input.activePointer.y < 0 || scene.input.activePointer.y > safeMarginTop);
    const isOnGround = spriteWithDynamicBody.body.onFloor();
    const isClimbing = ladderClimbing.isClimbing;

    const isOkToJump = (isOnGround || isClimbing) && spriteWithDynamicBody.x < noJumpZoneX;

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
