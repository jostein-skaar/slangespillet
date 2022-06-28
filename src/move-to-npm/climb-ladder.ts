import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { Hero } from '../hero';

enum ClimbingStates {
  None = 0,
  UpStart,
  UpClimb,
  UpFinish,
  DownStart,
  DownClimb,
  DownFinish,
}

export class LadderClimbing {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  hero: Hero;
  speed = adjustForPixelRatio(80);
  isHappening = false;
  isClimbing = false;
  direction = 0;
  state: ClimbingStates = ClimbingStates.None;
  hitBoxX: number = -1;
  hitBoxY: number = -1;

  constructor(sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, hero: Hero) {
    this.sprite = sprite;
    this.hero = hero;
  }

  climb(x: number, y: number, direction: number) {
    if (this.hitBoxX === x && this.hitBoxY === y) {
      return;
    }

    // Make sure the climbing is not interrupted by some other hit boxes.
    if (this.isHappening && this.hitBoxX !== x) {
      return;
    }

    this.hitBoxX = x;
    this.hitBoxY = y;

    if (this.isHappening) {
      if (this.direction === -1) {
        this.state = ClimbingStates.UpFinish;
      } else if (this.direction === 1) {
        this.state = ClimbingStates.DownFinish;
      }
    } else {
      this.isHappening = true;
      this.direction = direction;
      if (this.direction === -1) {
        this.state = ClimbingStates.UpStart;
      } else if (this.direction === 1) {
        this.state = ClimbingStates.DownStart;
      }
    }

    // console.log('climb state', this.state);
  }

  update(_delta: number) {
    if (this.state === ClimbingStates.None) {
      this.isHappening = false;
      this.isClimbing = false;
      this.sprite.body.setSize(this.hero.width, this.hero.height, false);
    }

    // Climb up
    if (this.state === ClimbingStates.UpStart) {
      if (this.sprite.x >= this.hitBoxX) {
        this.state = ClimbingStates.UpClimb;
        this.sprite.body.setSize(this.hero.widthClimbing, this.hero.heightClimbing, false);
        this.isClimbing = true;
        this.sprite.setVelocityX(0);
        this.sprite.setY(this.hitBoxY - this.hero.heightClimbing / 2);
      }
    } else if (this.state === ClimbingStates.UpClimb) {
      this.sprite.setVelocityY(this.direction * this.speed);
      this.sprite.setX(this.hitBoxX);
    } else if (this.state === ClimbingStates.UpFinish) {
      this.sprite.setVelocityY(this.direction * this.speed);
      if (this.sprite.y <= this.hitBoxY - this.hero.heightClimbing / 2) {
        this.state = ClimbingStates.None;
      }
    }

    // Climb down
    if (this.state === ClimbingStates.DownStart) {
      if (this.sprite.x >= this.hitBoxX) {
        this.state = ClimbingStates.DownClimb;
        this.sprite.body.setSize(this.hero.widthClimbing, this.hero.heightClimbing, false);
        this.isClimbing = true;
        this.sprite.setVelocityX(0);
        this.sprite.setY(this.hitBoxY);
      }
    } else if (this.state === ClimbingStates.DownClimb) {
      this.sprite.setVelocityY(this.direction * this.speed);
      this.sprite.setX(this.hitBoxX);
    } else if (this.state === ClimbingStates.DownFinish) {
      this.state = ClimbingStates.None;
    }
  }
}
