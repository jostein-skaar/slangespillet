export function jumpWithLongPress(
  scene: Phaser.Scene,
  spriteWithDynamicBody: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): () => boolean {
  const maxJumpingTime = 500;

  let jumpTime = 0;

  return () => {
    const delta = scene.game.loop.delta;
    const tryingToJump = scene.input.activePointer.isDown;
    const isOnGround = spriteWithDynamicBody.body.onFloor();

    if (tryingToJump && isOnGround) {
      jumpTime = delta;
    } else if (tryingToJump && jumpTime > 0 && jumpTime < maxJumpingTime) {
      jumpTime += delta;
    } else {
      jumpTime = 0;
    }

    return jumpTime > 0;
  };
}
