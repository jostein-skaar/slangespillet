import { adjustForPixelRatio } from '@jostein-skaar/common-game';

export class Icon {
  constructor(
    scene: Phaser.Scene,
    name: string,
    x: number,
    y: number,
    color: number,
    fill: number,
    callbackFn: () => void,
    size: number = adjustForPixelRatio(32)
  ) {
    scene.add
      .sprite(x, y, 'sprites', 'icon-bg-001.png')
      .setTintFill(fill)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setInteractive(new Phaser.Geom.Rectangle(0, 0, size, size), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', callbackFn);
    // scene.input.enableDebug(bgSprite);
    const spriteNames: string[] = [];
    if (name === 'pause') {
      spriteNames.push('icon-pause-001.png');
    } else if (name === 'gear') {
      spriteNames.push('icon-gear-001.png');
      spriteNames.push('icon-gear-002.png');
    }

    scene.add.sprite(x, y, 'sprites', spriteNames[0]).setTintFill(color).setOrigin(0, 0).setScrollFactor(0);

    // We have more frames, let's create an animation.
    // if (spriteNames.length > 1) {
    //   const frames: Phaser.Types.Animations.AnimationFrame[] = [];
    //   for (const spriteName of spriteNames) {
    //     frames.push({ key: 'sprites', frame: spriteName });
    //     console.log(spriteName);
    //   }

    //   iconSprite.anims.create({ key: 'loop', frames, frameRate: 2, repeat: -1 });
    //   iconSprite.play('loop');
    // }
  }
}
