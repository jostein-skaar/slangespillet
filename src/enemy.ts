import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { Position } from './move-to-npm/position';

export class Enemy extends Phaser.GameObjects.Container {
  static width = adjustForPixelRatio(80);
  static height = adjustForPixelRatio(35);
  private direction = 1;
  private static isInitialized = false;
  leftPosition!: Position;
  rightPosition!: Position;
  isDead = false;

  constructor(scene: Phaser.Scene, startPositionInMap: Position, endPositionInMap: Position, color: number) {
    super(scene, 0, 0, undefined);

    if (!Enemy.isInitialized) {
      Enemy.initializeAnimations(scene);
      Enemy.isInitialized = true;
    }

    scene.add.existing(this);

    this.setSize(Enemy.width, Enemy.height);

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

    this.setPositions(startPositionInMap, endPositionInMap);
  }

  preUpdate(_time: number, _delta: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    body.setVelocityX(this.direction * 40);

    if (this.direction === 1 && this.x > this.rightPosition.x) {
      this.direction = -1;
      this.setFlipX(true);
    } else if (this.direction === -1 && this.x < this.leftPosition.x) {
      this.direction = 1;
      this.setFlipX(false);
    }
  }

  private setPositions(startPositionInMap: Position, endPositionInMap: Position) {
    this.direction = 1;
    if (startPositionInMap.x > endPositionInMap.x) {
      this.direction = -1;
    }

    const leftPositionInMap = this.direction === -1 ? endPositionInMap : startPositionInMap;
    const rightPositionInMap = this.direction === -1 ? startPositionInMap : endPositionInMap;

    this.leftPosition = { x: leftPositionInMap.x + Enemy.width / 2, y: leftPositionInMap.y - Enemy.height / 2 };
    this.rightPosition = { x: rightPositionInMap.x - Enemy.width / 2, y: rightPositionInMap.y - Enemy.height / 2 };

    if (this.direction === 1) {
      this.setPosition(this.leftPosition.x, this.leftPosition.y);
      this.setFlipX(false);
    } else {
      this.setPosition(this.rightPosition.x, this.rightPosition.y);
      this.setFlipX(true);
    }
  }

  kill() {
    this.setActive(false);
    this.setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setEnable(false);
  }

  reset(startPositionInMap: Position, endPositionInMap: Position) {
    this.setPositions(startPositionInMap, endPositionInMap);
    this.setActive(true);
    this.setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setEnable(true);
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
      key: 'enemy-eye',
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
