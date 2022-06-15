import { defineComponent, Types } from 'bitecs';

export const PlayerComponent = defineComponent({
  isOnGround: Types.ui8,
  isMoving: Types.ui8,
  isHurting: Types.ui8,
  jumpTime: Types.ui32,
});

export const PositionComponent = defineComponent({
  x: Types.f32,
  y: Types.f32,
});

export const SpriteComponent = defineComponent({
  texture: Types.ui8,
});

export const VelocityComponent = defineComponent({
  x: Types.f32,
  y: Types.f32,
  shouldUpdateX: Types.ui8,
  shouldUpdateY: Types.ui8,
});

export const InputComponent = defineComponent({
  isJumping: Types.ui8,
});
