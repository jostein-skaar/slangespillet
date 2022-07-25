import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { LadderClimbing } from './move-to-npm/climb-ladder';
import { jumpWithLongPress } from './move-to-npm/jump-with-long-press';

export class Hero {
  // TODO:} extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  width: number;
  height: number;
  widthClimbing: number;
  heightClimbing: number;
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  jumpMethod: () => boolean;
  private ladderClimbing: LadderClimbing;
  isEating = false;
  isDead = false;
  speedX = adjustForPixelRatio(100);
  speedY = adjustForPixelRatio(-200);
  isHurting = false;
  isPotentialHurting = false;
  hurtTween: Phaser.Tweens.Tween;
  maxHurtingTime = 2000;
  timeSinceHurting: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.width = adjustForPixelRatio(70);
    this.height = adjustForPixelRatio(55);
    this.widthClimbing = adjustForPixelRatio(32);
    this.heightClimbing = adjustForPixelRatio(70);

    this.sprite = scene.physics.add.sprite(0, 0, 'sprites', 'hero-001.png');
    this.createAnimations();

    this.ladderClimbing = new LadderClimbing(this.sprite, this);
    this.jumpMethod = jumpWithLongPress(scene, this.sprite, this.ladderClimbing);

    this.scene.events.on('level-finished', () => {
      this.isEating = true;
    });

    this.hurtTween = scene.tweens.add({
      targets: this.sprite,
      scale: 0.8,
      ease: 'Power0',
      duration: 40,
      yoyo: true,
      repeat: 10,
      paused: true,
      onActive: () => {
        this.sprite.setTint(0xff0000);
      },
      onComplete: () => {
        this.sprite.setTint(undefined);
      },
    });
  }

  climbLadder(x: number, y: number, direction: number) {
    this.ladderClimbing.climb(x, y, direction);
  }

  reset(xInLevel: number, yInLevel: number) {
    const x = xInLevel;
    const y = yInLevel - this.height / 2;
    this.isDead = false;
    this.isEating = false;
    this.sprite.setPosition(x, y);
  }

  update(delta: number) {
    if (this.timeSinceHurting > this.maxHurtingTime) {
      this.isHurting = false;
    }
    if (this.isPotentialHurting && this.timeSinceHurting > this.maxHurtingTime) {
      console.log('Au au');
      this.isHurting = true;
      this.hurtTween.play();
      this.timeSinceHurting = 0;
    }

    this.timeSinceHurting += this.scene.game.loop.delta;

    // console.log('this.timeSinceHurting counter', this.timeSinceHurting);

    this.updateAnimations(this.scene.physics.world.isPaused, this.ladderClimbing.isClimbing, this.isHurting, this.isEating);
    const isJumping = this.jumpMethod();

    if (this.isEating) {
      this.sprite.setVelocityX(this.speedX / 2);
    } else if (this.ladderClimbing.isHappening) {
      this.ladderClimbing.update(delta);
      // Need to keep moving until we actual climb
      if (!this.ladderClimbing.isClimbing) {
        this.sprite.setVelocityX(this.speedX);
      }
    } else {
      this.sprite.setVelocityX(this.speedX);
      if (isJumping) {
        this.sprite.setVelocityY(this.speedY);
      }
    }

    // Reset in every update.
    this.isPotentialHurting = false;
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
      frames: [
        { key: 'sprites', frame: 'hero-003.png' },
        { key: 'sprites', frame: 'hero-004.png' },
      ],
      frameRate: 6,
    });
    this.sprite.anims.create({
      key: 'eat',
      frames: [
        { key: 'sprites', frame: 'hero-005.png' },
        { key: 'sprites', frame: 'hero-006.png' },
      ],
      frameRate: 5,
    });
    this.sprite.anims.create({
      key: 'climb',
      frames: [
        { key: 'sprites', frame: 'hero-007.png' },
        { key: 'sprites', frame: 'hero-008.png' },
      ],
      frameRate: 5,
    });
  }

  private updateAnimations(isPaused: boolean, isClimbing: boolean, isHurting: boolean, isEating: boolean) {
    if (this.isDead) {
      this.sprite.setTint(0xff0000);
      this.sprite.play('stand', true);
      return;
    } else if (isHurting) {
      // Tinting handeled by tween
    } else {
      this.sprite.setTint(undefined);
    }

    if (isPaused) {
      return;
    }

    if (isClimbing) {
      this.sprite.play('climb', true);
    } else if (isEating) {
      this.sprite.play('eat', true);
    } else {
      if (this.sprite.body.onFloor() && !this.sprite.body.onWall()) {
        this.sprite.play('walk', true);
      } else if (!this.sprite.body.onFloor()) {
        this.sprite.play('jump', true);
      } else {
        this.sprite.play('stand', true);
      }
    }
  }
}
