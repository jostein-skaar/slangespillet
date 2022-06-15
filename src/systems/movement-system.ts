import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import { defineSystem, defineQuery, enterQuery } from 'bitecs';
import { InputComponent, PositionComponent, VelocityComponent } from '../components';

export function createMovementSystem() {
  const movementQuery = defineQuery([PositionComponent, VelocityComponent, InputComponent]);
  const movementQueryEnter = enterQuery(movementQuery);

  const speedX = adjustForPixelRatio(100);
  const speedY = adjustForPixelRatio(-200);
  return defineSystem((world) => {
    const entities = movementQuery(world);

    const entitiesEntered = movementQueryEnter(world);
    for (let i = 0; i < entitiesEntered.length; ++i) {
      const eid = entitiesEntered[i];
      VelocityComponent.shouldUpdateX[eid] = 1;
      VelocityComponent.shouldUpdateY[eid] = 0;
    }

    for (let i = 0; i < entities.length; ++i) {
      const eid = entities[i];
      console.log(PositionComponent.y[eid]);
      VelocityComponent.x[eid] = speedX;
      VelocityComponent.y[eid] = speedY;
      VelocityComponent.shouldUpdateY[eid] = InputComponent.isJumping[eid];
    }

    return world;
  });
}
