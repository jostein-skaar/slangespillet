import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { Enemy } from './enemy';
import { Hero } from './hero';

export class Level {
  private scene: Phaser.Scene;
  private map: Phaser.Tilemaps.Tilemap;
  level: number;
  hero: Hero;
  platformLayer: Phaser.Tilemaps.TilemapLayer;
  presentsLayer: Phaser.Tilemaps.TilemapLayer;
  presentGroup: Phaser.Physics.Arcade.Group;
  enemyGroup: Phaser.Physics.Arcade.Group;
  ladderGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, level: number, hero: Hero) {
    this.scene = scene;
    this.map = map;
    this.level = level;
    this.hero = hero;

    this.presentGroup = scene.physics.add.group({ allowGravity: false });
    this.enemyGroup = scene.physics.add.group();

    this.ladderGroup = scene.physics.add.group({ allowGravity: false });

    const tiles = map.getTileset('tiles');

    this.platformLayer = map.createLayer(`level${level}/level`, [tiles]);
    this.platformLayer.setCollisionByProperty({ ground: true });
    this.presentsLayer = map.createLayer(`level${level}/presents`, [tiles]);
    this.reset();
  }

  reset() {
    this.resetPresents();
    this.resetEnemies();
    this.resetLadders();
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

    const l = this.map.getObjectLayer(`level${this.level}/data`).objects;
    console.log(l.find((x) => x.name === 'hero'));
    console.log(l.filter((x) => x.name === 'slange'));

    const color = new Phaser.Display.Color();

    for (let index = 0; index < 5; index++) {
      let enemy = this.enemyGroup.getFirstDead() as Enemy;
      if (enemy === null) {
        enemy = new Enemy(
          this.scene,
          Phaser.Math.Between(0, this.map.widthInPixels),
          Phaser.Math.Between(0, this.map.heightInPixels) - adjustForPixelRatio(50) / 2,
          color.random(60, 240).color,
          this.hero
        );
        this.enemyGroup.add(enemy);
      } else {
        enemy.setPosition(
          Phaser.Math.Between(0, this.map.widthInPixels),
          Phaser.Math.Between(0, this.map.heightInPixels) - adjustForPixelRatio(50) / 2
        );
        enemy.setActive(true);
      }
    }

    // const enemy1 = new Enemy(
    //   this,
    //   startPositionInLevel.x + 220,
    //   startPositionInLevel.y - adjustForPixelRatio(50) / 2,
    //   color.random(60, 240).color,
    //   this.hero
    // );
    // this.level.enemyGroup.add(enemy1);

    // const enemy2 = new Enemy(
    //   this,
    //   startPositionInLevel.x + 330,
    //   startPositionInLevel.y - adjustForPixelRatio(50) / 2,
    //   color.random(60, 240).color,
    //   this.hero
    // );
    // this.level.enemyGroup.add(enemy2);

    // const enemy3 = new Enemy(this, startPositionInLevel.x + 700, adjustForPixelRatio(200), color.random(60, 240).color, this.hero);
    // this.level.enemyGroup.add(enemy3);
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
