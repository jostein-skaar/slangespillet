import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { LadderClimbing } from './move-to-npm/climb-ladder';
import { jumpWithLongPress } from './move-to-npm/jump-with-long-press';
import { Position } from './move-to-npm/position';

export class Hero {
  // TODO:} extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  width: number;
  height: number;
  widthClimbing: number;
  heightClimbing: number;
  startPosition: Position;
  sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  jumpMethod: () => boolean;
  private ladderClimbing: LadderClimbing;
  isDead = false;
  speedX = adjustForPixelRatio(100);
  speedY = adjustForPixelRatio(-200);
  isTransistionToClimpbingUp = false;
  climbingX = 0;
  climbingY = 0;
  climbingDirection = 0;

  constructor(scene: Phaser.Scene, startPositionInLevel: Position) {
    this.scene = scene;
    this.width = adjustForPixelRatio(70);
    this.height = adjustForPixelRatio(55);
    this.widthClimbing = adjustForPixelRatio(32);
    this.heightClimbing = adjustForPixelRatio(70);
    this.startPosition = { x: startPositionInLevel.x + this.width / 2, y: startPositionInLevel.y - this.height / 2 };

    this.sprite = scene.physics.add.sprite(this.startPosition.x, this.startPosition.y, 'sprites', 'hero-001.png');
    this.createAnimations();

    this.jumpMethod = jumpWithLongPress(scene, this.sprite);
    this.ladderClimbing = new LadderClimbing(this.sprite, this);
  }

  climbLadder(x: number, y: number, direction: number) {
    this.ladderClimbing.climb(x, y, direction);
  }

  reset() {
    this.isDead = false;
    this.sprite.setPosition(this.startPosition.x, this.startPosition.y);
  }

  update(delta: number) {
    this.updateAnimations(this.scene.physics.world.isPaused, this.ladderClimbing.isClimbing);

    if (this.ladderClimbing.isHappening) {
      this.ladderClimbing.update(delta);
    } else {
      this.sprite.setVelocityX(this.speedX);
      if (this.jumpMethod()) {
        this.sprite.setVelocityY(this.speedY);
      }
    }
    // this.climbLadderMethod(delta);
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
      key: 'climb',
      frames: [
        { key: 'sprites', frame: 'hero-005.png' },
        { key: 'sprites', frame: 'hero-006.png' },
      ],
      frameRate: 5,
    });
  }

  private updateAnimations(isPaused: boolean, isClimbing: boolean) {
    if (this.isDead) {
      this.sprite.setTint(0xff0000);
      this.sprite.play('stand', true);
      return;
    }
    this.sprite.setTint(undefined);
    if (isPaused) {
      return;
    }

    if (isClimbing) {
      this.sprite.play('climb', true);
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
