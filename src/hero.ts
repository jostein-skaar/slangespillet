import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { jumpWithLongPress } from './jump-with-long-press';
import { Position } from './slangespillet';

export class Hero {
  // TODO:} extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  width: number;
  height: number;
  startPosition: Position;
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  jumpMethod: () => boolean;
  isDead = false;
  speedX = adjustForPixelRatio(100);
  speedY = adjustForPixelRatio(-200);

  constructor(scene: Phaser.Scene, startPositionInLevel: Position) {
    this.scene = scene;
    this.width = adjustForPixelRatio(70);
    this.height = adjustForPixelRatio(55);
    this.startPosition = { x: startPositionInLevel.x + this.width / 2, y: startPositionInLevel.y - this.height / 2 };

    this.sprite = scene.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'sprites', 'hero-001.png');
    this.createAnimations();

    this.jumpMethod = jumpWithLongPress(scene, this.sprite);
  }

  reset() {
    this.isDead = false;
    this.sprite.setPosition(this.startPosition.x, this.startPosition.y);
  }

  update() {
    this.updateAnimations(this.scene.physics.world.isPaused);
    this.sprite.setVelocityX(this.speedX);
    if (this.jumpMethod()) {
      this.sprite.setVelocityY(this.speedY);
    }
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

  private updateAnimations(isPaused: boolean) {
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
}
