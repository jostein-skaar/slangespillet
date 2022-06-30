import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { Hero } from './hero';

export class Enemy extends Phaser.GameObjects.Container {
  width: number;
  height: number;
  private hero: Hero;
  private direction = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, color: number, hero: Hero) {
    super(scene, x, y, undefined);

    this.width = adjustForPixelRatio(115);
    this.height = adjustForPixelRatio(50);
    this.hero = hero;
    scene.add.existing(this);

    this.setSize(this.width, this.height);

    // this.enemyC.setSize(120, 50);
    const tounge = scene.add.sprite(0, 0, 'sprites', 'enemy-tounge-001.png');
    tounge.anims.create({
      key: 'sss',
      frames: [
        { key: 'sprites', frame: 'enemy-tounge-001.png' },
        { key: 'sprites', frame: 'enemy-tounge-002.png' },
      ],
      frameRate: 2,
      repeat: -1,
      delay: 1500,
      repeatDelay: 2000,
    });
    tounge.play('sss', true);
    this.add(tounge);

    const teeth = scene.add.sprite(0, 0, 'sprites', 'enemy-teeth-001.png');
    this.add(teeth);

    const body = scene.add.sprite(0, 0, 'sprites', 'enemy-body-001.png');
    body.setTint(color);
    body.anims.create({
      key: 'walk',
      frames: [
        { key: 'sprites', frame: 'enemy-body-001.png' },
        { key: 'sprites', frame: 'enemy-body-002.png' },
        { key: 'sprites', frame: 'enemy-body-003.png' },
      ],
      frameRate: 4,
      repeat: -1,
    });
    body.play('walk', true);
    this.add(body);

    const hair = scene.add.sprite(0, 0, 'sprites', 'enemy-hair-001.png');
    hair.anims.create({
      key: 'wave',
      frames: [
        { key: 'sprites', frame: 'enemy-hair-001.png' },
        { key: 'sprites', frame: 'enemy-hair-002.png' },
        { key: 'sprites', frame: 'enemy-hair-003.png' },
      ],
      frameRate: 2,
      repeat: -1,
    });
    hair.play('wave', true);
    this.addAt(hair, 0);

    const eye = scene.add.sprite(0, 0, 'sprites', 'enemy-eye-001.png');
    eye.anims.create({
      key: 'blink',
      frames: [
        { key: 'sprites', frame: 'enemy-eye-001.png' },
        { key: 'sprites', frame: 'enemy-eye-002.png' },
        { key: 'sprites', frame: 'enemy-eye-001.png' },
        { key: 'sprites', frame: 'enemy-eye-002.png' },
        { key: 'sprites', frame: 'enemy-eye-001.png' },
      ],
      frameRate: 7,
      repeat: -1,
      delay: Phaser.Math.Between(2, 6) * 1000,
      repeatDelay: 5000,
    });
    eye.play('blink', true);
    this.add(eye);
  }

  setFlipX(flip: boolean) {
    this.iterate((go: any) => (go.flipX = flip));
  }

  preUpdate(_time: number, _delta: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    body.setVelocityX(this.direction * 40);

    if (this.direction === 1 && this.x > this.hero.sprite.x + adjustForPixelRatio(400)) {
      this.direction = -1;
      this.setFlipX(true);
      // body.flipX = true;
    } else if (this.direction === -1 && this.x < this.hero.sprite.x) {
      this.direction = 1;
      this.setFlipX(false);
      // this.enemy01.flipX = false;
    }
  }
}
