import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { Enemy } from './enemy';
import { Hero } from './hero';
import { Position } from './move-to-npm/position';

export class Level {
  private scene: Phaser.Scene;
  private map: Phaser.Tilemaps.Tilemap;
  level: number;
  hero: Hero;
  platformLayer: Phaser.Tilemaps.TilemapLayer;
  presentsLayer: Phaser.Tilemaps.TilemapLayer;
  presentGroup: Phaser.Physics.Arcade.Group;
  enemyGroup: Phaser.Physics.Arcade.Group;
  finishSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  ladderGroup: Phaser.Physics.Arcade.Group;
  color = new Phaser.Display.Color();
  finished = false;

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, level: number, hero: Hero) {
    this.scene = scene;
    this.map = map;
    this.level = level;
    this.hero = hero;

    this.finishSprite = scene.physics.add.sprite(0, 0, 'sprites', 'object-moringa-001.png');
    this.finishSprite.setSize(adjustForPixelRatio(1), this.scene.scale.height * 2);
    this.finishSprite.setImmovable();
    this.finishSprite.body.setAllowGravity(false);
    this.finishSprite.setDepth(this.hero.sprite.depth + 1);
    this.finishSprite.anims.create({
      key: 'moringa-eaten',
      frames: [
        { key: 'sprites', frame: 'object-moringa-002.png' },
        { key: 'sprites', frame: 'object-moringa-003.png' },
      ],
      frameRate: 4,
      repeat: -1,
    });

    this.presentGroup = scene.physics.add.group({ allowGravity: false });
    this.enemyGroup = scene.physics.add.group();

    this.ladderGroup = scene.physics.add.group({ allowGravity: false });

    const tiles = map.getTileset('tiles');

    this.platformLayer = map.createLayer(`level${level}/level`, [tiles]);
    this.platformLayer.setCollisionByProperty({ ground: true });
    this.presentsLayer = map.createLayer(`level${level}/presents`, [tiles]);

    scene.physics.add.overlap(this.hero.sprite, this.enemyGroup, (_helt, enemy: any) => {
      enemy = enemy as Enemy;
      if (enemy.body.touching.up) {
        enemy.kill();
      } else {
        console.log('Au au');
        this.scene.events.emit('hero-hurting');
      }
    });

    scene.physics.add.overlap(this.hero.sprite, this.finishSprite, (_helt, _finish) => {
      if (!this.finished) {
        this.finishSprite.setRotation(0.4);
        this.scene.events.emit('level-finished');
        this.finished = true;
        this.finishSprite.anims.play('moringa-eaten');
      }
      this.finishSprite.setX(this.hero.sprite.x + this.hero.width / 2);
    });

    this.reset();
  }

  reset() {
    this.resetPresents();
    this.resetEnemies();
    this.resetLadders();
    this.resetHero();
    this.resetFinish();
  }

  private resetHero() {
    const dataLayer = this.map.getObjectLayer(`level${this.level}/data`).objects;
    const startPoint = dataLayer.find((x) => x.name === 'start');
    this.hero.reset(startPoint!.x as number, startPoint!.y as number);
  }

  private resetFinish() {
    const dataLayer = this.map.getObjectLayer(`level${this.level}/data`).objects;
    const finishPoint = dataLayer.find((x) => x.name === 'finish');
    const x = finishPoint!.x as number;
    const y = (finishPoint!.y as number) - this.finishSprite.height / 2;
    this.finishSprite.setPosition(x, y);
  }

  private resetPresents() {
    for (const gameObject of this.presentGroup.getChildren()) {
      gameObject.setActive(false);
    }

    const presentsFirstGid = this.map.tilesets.find((x) => x.name.startsWith('presents'))?.firstgid!;

    this.presentsLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      if (tile.properties.present === true) {
        const present: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = this.presentGroup
          .get(tile.pixelX, tile.pixelY, 'present', tile.index - presentsFirstGid)
          .setOrigin(0, 0);
        present.enableBody(false, 0, 0, true, true);
      }
    });
  }

  private resetEnemies() {
    for (const gameObject of this.enemyGroup.getChildren()) {
      gameObject.setActive(false);
    }

    const dataLayer = this.map.getObjectLayer(`level${this.level}/data`).objects;
    const enemyObjects = dataLayer.filter((x) => x.name === 'enemy');

    for (const enemyObject of enemyObjects) {
      const startPositionInMap: Position = {
        x: (enemyObject.x as number) + (enemyObject.polyline![0].x as number),
        y: (enemyObject.y as number) + (enemyObject.polyline![0].y as number),
      };

      const endPositionInMap: Position = {
        x: (enemyObject.x as number) + (enemyObject.polyline![1].x as number),
        y: (enemyObject.y as number) + (enemyObject.polyline![1].y as number),
      };

      let enemy = this.enemyGroup.getFirstDead() as Enemy;
      if (enemy === null) {
        enemy = new Enemy(this.scene, startPositionInMap, endPositionInMap, this.color.random(60, 240).color);
        this.enemyGroup.add(enemy);
      } else {
        enemy.reset(startPositionInMap, endPositionInMap);
      }
    }
  }

  private resetLadders() {
    const createHitBox = (tile: Phaser.Tilemaps.Tile, offsetY: number): Phaser.GameObjects.Rectangle => {
      const sizeHitBox = 6;
      return this.scene.add.rectangle(
        tile.pixelX + tile.width / 2,
        tile.pixelY + offsetY - sizeHitBox / 2,
        sizeHitBox,
        sizeHitBox,
        0x000000,
        0
      );
    };

    this.platformLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      if (tile.properties.ladderup === true) {
        const hitBox = createHitBox(tile, tile.height) as any;
        this.ladderGroup.add(hitBox);
        hitBox.direction = -1;
      } else if (tile.properties.ladderdown === true) {
        const hitBox = createHitBox(tile, 0) as any;
        this.ladderGroup.add(hitBox);
        hitBox.direction = 1;
      }
    });
  }
}
