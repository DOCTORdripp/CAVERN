import { engine, GltfContainer, InputAction, PointerEventType, PointerEvents, Schemas, Transform, 
  pointerEventsSystem, AudioSource, AvatarAttach,  AvatarAnchorPointType, inputSystem } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { createSound } from './sound'
import { miniforcefieldEntity } from './powerBase'
import {particleParentEntity2} from './particles'
import { indicatorArrowPurple1, indicatorArrowPurple2, indicatorArrowPurple3 } from '.'

export const PowerCube = engine.defineComponent('PowerCube', {
  isGrabbed: Schemas.Boolean
})

// Sounds
const cubePickUpSound = createSound('sounds/cubePickup.mp3')
const cubePutDownSound = createSound('sounds/cubePutDown.mp3')

// Configuration
const Z_OFFSET = 1.5
const GROUND_HEIGHT = 0.55

export function createPowerCube(position: Vector3, gltfSrc: string) {
  const entity = engine.addEntity()
  Transform.create(entity, { position: position, scale: Vector3.create(0,0,0) })
  GltfContainer.create(entity, { src: gltfSrc })
  PowerCube.create(entity, { isGrabbed: false })

  pointerEventsSystem.onPointerDown(
    entity,
    () => {
      const powerCube = PowerCube.getMutable(entity)

      if (!powerCube.isGrabbed) {
        const transform = Transform.getMutable(entity)
        powerCube.isGrabbed = true
        AudioSource.getMutable(cubePickUpSound).playing = true

        //disable mini force field & indicator arrow swap
        Transform.getMutable(miniforcefieldEntity).scale = Vector3.Zero()
        Transform.getMutable(particleParentEntity2).scale = Vector3.Zero()
        Transform.getMutable(indicatorArrowPurple1).scale = Vector3.Zero();
        Transform.getMutable(indicatorArrowPurple2).scale = Vector3.create(6,6,6);
        Transform.getMutable(indicatorArrowPurple3).scale = Vector3.create(6,6,6);

        // Calculates the crate's position relative to the camera
        transform.position = Vector3.Zero()
        transform.rotation = Quaternion.Identity()
        transform.position.y = -1
        transform.position.z += Z_OFFSET
        transform.scale = Vector3.create(0.5,0.5,0.5)

        const dummyParent = engine.addEntity()
        Transform.create(dummyParent, {})

        transform.parent = dummyParent

        AvatarAttach.createOrReplace(transform.parent, {
          anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
        })

        const pointerEvent = PointerEvents.getMutable(entity).pointerEvents[0]
        if (pointerEvent && pointerEvent.eventInfo) {
          pointerEvent.eventInfo.showFeedback = false
        }
      }
    },
    {
      button: InputAction.IA_PRIMARY,
      hoverText: 'PICK UP DUSTY RELIC',
      maxDistance: 15
    }
  )

  utils.triggers.addTrigger(entity, 2, 2, [{ type: 'box', scale: Vector3.create(1, 1, 1) }])

  return entity
}

engine.addSystem(() => {
  if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
    for (const [entity] of engine.getEntitiesWith(PowerCube)) {
      const powerCube = PowerCube.getMutable(entity)

      if (powerCube.isGrabbed) {
        const transform = Transform.getMutable(entity)
        powerCube.isGrabbed = false
        AudioSource.getMutable(cubePutDownSound).playing = true

        const cameraTransform = Transform.get(engine.PlayerEntity)
        const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), Z_OFFSET), cameraTransform.rotation)

        transform.position = Vector3.add(cameraTransform.position, forwardVector)
        transform.position.y = GROUND_HEIGHT

        transform.rotation = Quaternion.fromLookAt(transform.position, cameraTransform.position)
        transform.rotation.x = 0
        transform.rotation.z = 0

        transform.parent = undefined

        const pointerEvent = PointerEvents.getMutable(entity).pointerEvents[0]
        if (pointerEvent && pointerEvent.eventInfo) {
          pointerEvent.eventInfo.showFeedback = true
        }
      }
    }
  }
})

