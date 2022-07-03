import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { Hero } from './hero';

export class Enemy extends Phaser.GameObjects.Container {
  width: number;
  height: number;
  private hero: Hero;
  private direction = 1;
  private static isInitialized = false;

  constructor(scene: Phaser.Scene, x: number, y: number, color: number, hero: Hero) {
    super(scene, x, y, undefined);

    if (!Enemy.isInitialized) {
      Enemy.initializeAnimations(scene);
      Enemy.isInitialized = true;
    }

    this.width = adjustForPixelRatio(115);
    this.height = adjustForPixelRatio(50);
    this.hero = hero;
    scene.add.existing(this);

    this.setSize(this.width, this.height);

    // this.enemyC.setSize(120, 50);
    const tounge = scene.add.sprite(0, 0, 'sprites', 'enemy-tounge-001.png');
    tounge.play('enemy-tounge', true);
    this.add(tounge);

    const teeth = scene.add.sprite(0, 0, 'sprites', 'enemy-teeth-001.png');
    this.add(teeth);

    const body = scene.add.sprite(0, 0, 'sprites', 'enemy-body-001.png');
    body.setTint(color);
    body.play('enemy-body', true);
    this.add(body);

    const hair = scene.add.sprite(0, 0, 'sprites', 'enemy-hair-001.png');
    hair.play('enemy-hair', true);
    this.addAt(hair, 0);

    const eye = scene.add.sprite(0, 0, 'sprites', 'enemy-eye-001.png');
    eye.play('enemy-eye', true);
    this.add(eye);
  }

  preUpdate(_time: number, _delta: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    body.setVelocityX(this.direction * 40);

    if (this.direction === 1 && this.x > this.hero.sprite.x + adjustForPixelRatio(200)) {
      this.direction = -1;
      this.setFlipX(true);
    } else if (this.direction === -1 && this.x < this.hero.sprite.x) {
      this.direction = 1;
      this.setFlipX(false);
    }
  }

  private setFlipX(flip: boolean) {
    this.iterate((gameObject: any) => (gameObject.flipX = flip));
  }

  private static initializeAnimations(scene: Phaser.Scene) {
    scene.anims.create({
      key: 'enemy-tounge',
      frames: [
        { key: 'sprites', frame: 'enemy-tounge-001.png' },
        { key: 'sprites', frame: 'enemy-tounge-002.png' },
      ],
      frameRate: 2,
      repeat: -1,
      delay: 1500,
      repeatDelay: 2000,
    });

    scene.anims.create({
      key: 'enemy-hair',
      frames: [
        { key: 'sprites', frame: 'enemy-hair-001.png' },
        { key: 'sprites', frame: 'enemy-hair-002.png' },
        { key: 'sprites', frame: 'enemy-hair-003.png' },
      ],
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: 'eye',
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

    scene.anims.create({
      key: 'enemy-body',
      frames: [
        { key: 'sprites', frame: 'enemy-body-001.png' },
        { key: 'sprites', frame: 'enemy-body-002.png' },
        { key: 'sprites', frame: 'enemy-body-003.png' },
      ],
      frameRate: 4,
      repeat: -1,
    });
  }
}
