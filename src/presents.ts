import { adjustForPixelRatio } from '@jostein-skaar/common-game';

export function resetPresents(
  presentsGroup: Phaser.Physics.Arcade.Group,
  map: Phaser.Tilemaps.Tilemap,
  platformLayer: Phaser.Tilemaps.TilemapLayer
) {
  console.log('Før', presentsGroup.getLength(), presentsGroup.getTotalUsed());

  for (const gameObject of presentsGroup.getChildren()) {
    gameObject.setActive(false);
  }

  const tilesSize = adjustForPixelRatio(32);

  const presentsFirstGid = map.tilesets.find((x) => x.name.startsWith('presents'))?.firstgid!;

  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      if (platformLayer.hasTileAt(x, y)) {
        const t = platformLayer.getTileAt(x, y);
        if (t.properties.present === true) {
          t.visible = false;
          const present: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = presentsGroup
            .get(x * tilesSize, y * tilesSize, 'present', t.index - presentsFirstGid)
            .setOrigin(0, 0);
          present.enableBody(false, 0, 0, true, true);
        }
      }
    }
  }

  console.log('Etter', presentsGroup.getLength(), presentsGroup.getTotalUsed());
}
