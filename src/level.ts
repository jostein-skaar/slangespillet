import { adjustForPixelRatio } from '@jostein-skaar/common-game';

export function createLevel(
  map: Phaser.Tilemaps.Tilemap,
  level: number,
  presentGroup: Phaser.Physics.Arcade.Group,
  enemyGroup: Phaser.Physics.Arcade.Group
): Phaser.Tilemaps.TilemapLayer {
  const tiles = map.getTileset('tiles');
  const tiledLevel = `level${level}`;
  let platformLayer = map.getLayer(tiledLevel).tilemapLayer;

  if (platformLayer === null) {
    platformLayer = map.createLayer(tiledLevel, [tiles]);
    platformLayer.setCollisionByProperty({ ground: true });
  }

  resetPresents(map, platformLayer, presentGroup);
  resetEnemies(map, platformLayer, enemyGroup);

  return platformLayer;
}

function resetPresents(map: Phaser.Tilemaps.Tilemap, platformLayer: Phaser.Tilemaps.TilemapLayer, group: Phaser.Physics.Arcade.Group) {
  console.log('resetPresents');

  for (const gameObject of group.getChildren()) {
    gameObject.setActive(false);
  }

  const presentsFirstGid = map.tilesets.find((x) => x.name.startsWith('presents'))?.firstgid!;

  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      if (platformLayer.hasTileAt(x, y)) {
        const t = platformLayer.getTileAt(x, y);
        if (t.properties.present === true) {
          t.visible = false;
          const present: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = group
            .get(x * map.tileWidth, y * map.tileHeight, 'present', t.index - presentsFirstGid)
            .setOrigin(0, 0);
          present.enableBody(false, 0, 0, true, true);
        }
      }
    }
  }
}

function resetEnemies(map: Phaser.Tilemaps.Tilemap, platformLayer: Phaser.Tilemaps.TilemapLayer, group: Phaser.Physics.Arcade.Group) {
  console.log('resetEnemies');
}
