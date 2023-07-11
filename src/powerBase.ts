import { AudioSource, engine, GltfContainer, PointerEvents, PointerEventType, Transform, VisibilityComponent } from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { Particle, particleSystem } from './particles'
import { createSound } from './sound'
import * as utils from '@dcl-sdk/utils'
import { PowerCube } from './powerCube'
import * as npc from 'dcl-npc-toolkit'
import { beckoning } from './dialogs'
import { splash, relicOnly, marsha2, indicatorArrowTeal, indicatorArrowTeal2, indicatorArrowTeal3, indicatorArrowPurple2, indicatorArrowPurple3 } from '.'

// Power glows
const powerBlueGlowEntity = engine.addEntity()
GltfContainer.create(powerBlueGlowEntity, { src: 'models/powerBlueGlow.glb' })
Transform.create(powerBlueGlowEntity, {
  position: Vector3.create(0, 0, 2),
  scale: Vector3.create(6,1,8)
})

const powerRedGlowEntity = engine.addEntity()
GltfContainer.create(powerRedGlowEntity, { src: 'models/powerRedGlow.glb' })
Transform.create(powerRedGlowEntity, {
  position: Vector3.create(0, 0, 2),
  scale: Vector3.create(6,1,8)
})

// Forcefield
const forcefieldEntity = engine.addEntity()
GltfContainer.create(forcefieldEntity, { src: 'models/forcefield.glb' })
Transform.create(forcefieldEntity)

// miniForcefield
export const miniforcefieldEntity = engine.addEntity()
GltfContainer.create(miniforcefieldEntity, { src: 'models/miniforcefield.glb' })
Transform.create(miniforcefieldEntity)

// Sounds
const powerUp = createSound('sounds/powerUp.mp3')
const powerDown = createSound('sounds/powerDown.mp3')

export function togglePower(isPowerOn: boolean) {
  if (isPowerOn) {
    // TODO: change this workaround until the DisableComponent is available
    Transform.getMutable(powerBlueGlowEntity).scale = Vector3.create(6, 1, 8);
    Transform.getMutable(forcefieldEntity).scale = Vector3.create(6, 1, 8);
    Transform.getMutable(miniforcefieldEntity).scale = Vector3.create(1, 1, 1);
    try {
      engine.addSystem(particleSystem);
    } catch (err) {}
    AudioSource.getMutable(powerUp).playing = true;

    for (const [entity] of engine.getEntitiesWith(Particle)) {
      VisibilityComponent.deleteFrom(entity);
    }
  } else {
    // NOTE: particles have colliders so need to move them elsewhere
    for (const [entity] of engine.getEntitiesWith(Particle)) {
      VisibilityComponent.createOrReplace(entity, { visible: false });
    }

    //washed relic PowerCube is hidden and removed
    for (const [entity] of engine.getEntitiesWith(PowerCube)) {
      VisibilityComponent.createOrReplace(entity, { visible: false });
      engine.removeEntity(entity)
    }

    // TODO: change this workaround until the DisableComponent is available
    // Hide the blue glow & purple indicator arrows
    Transform.getMutable(powerBlueGlowEntity).scale = Vector3.Zero();
    Transform.getMutable(forcefieldEntity).scale = Vector3.Zero();
    Transform.getMutable(indicatorArrowPurple2).scale = Vector3.Zero();
    Transform.getMutable(indicatorArrowPurple3).scale = Vector3.Zero();

    engine.removeSystem(particleSystem);
    AudioSource.getMutable(powerDown).playing = true;
  }
}

export function createPowerBase(position: Vector3, gltfSrc: string, scale: Vector3) {
  const entity = engine.addEntity();

  Transform.create(entity, { position, scale });
  GltfContainer.create(entity, { src: gltfSrc });
  PointerEvents.create(entity, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          showFeedback: false,
        },
      },
    ],
  });

  utils.triggers.addTrigger(
    entity,
    2,
    2,
    [
      {
        type: 'box',
        scale: Vector3.create(10, 4, 10), //change this value to adjust safe drop zone
        position: Vector3.create(-49, 0.75, 34),
      },
    ],
    (triggerEntity) => {
      console.log('on enter', { triggerEntity });
      togglePower(false);
      Transform.getMutable(relicOnly).scale = Vector3.create(1, 1, 1); //show relic
      Transform.getMutable(indicatorArrowTeal).scale = Vector3.create(3,3,3); //show mazeArrows
      Transform.getMutable(indicatorArrowTeal2).scale = Vector3.create(3,3,3); //show mazeArrows
      Transform.getMutable(indicatorArrowTeal3).scale = Vector3.create(3,3,3); //show mazeArrows      
      npc.talk(marsha2, beckoning)
      AudioSource.getMutable(splash).playing = true;
    },
    (triggerEntity) => {
      console.log('on exit', { triggerEntity });
      togglePower(true);
    }
  );
}


// Power base where the power cube sits
