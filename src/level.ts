export class Level {
  private scene: Phaser.Scene;
  private map: Phaser.Tilemaps.Tilemap;
  level: number;
  platformLayer: Phaser.Tilemaps.TilemapLayer;
  presentGroup: Phaser.Physics.Arcade.Group;
  enemyGroup: Phaser.Physics.Arcade.Group;
  ladderGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, level: number) {
    this.scene = scene;
    this.map = map;
    this.level = level;

    this.presentGroup = scene.physics.add.group({ allowGravity: false });
    this.enemyGroup = scene.physics.add.group();

    this.ladderGroup = scene.physics.add.group({ allowGravity: false });

    const tiles = map.getTileset('tiles');
    const tiledLevel = `level${level}`;

    this.platformLayer = map.createLayer(tiledLevel, [tiles]);
    this.platformLayer.setCollisionByProperty({ ground: true });
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

    this.platformLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      if (tile.properties.present === true) {
        tile.visible = false;
        const present: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = this.presentGroup
          .get(tile.pixelX, tile.pixelY, 'present', tile.index - presentsFirstGid)
          .setOrigin(0, 0);
        present.enableBody(false, 0, 0, true, true);
      }
    });
  }

  private resetEnemies() {
    console.log('resetEnemies');
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
