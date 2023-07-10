import { Vector3, Quaternion } from '@dcl/sdk/math'
import { engine, GltfContainer, Transform, Animator,PointerEvents,
  PointerEventType,
  InputAction, Entity } from '@dcl/sdk/ecs'
import { Zombie } from '../definitions'
import { MoveTransformComponent, MoveTransformFinishedComponent } from '../components/moveTransport'
import { ZombieComponent } from '../components/zombie'
import { movePlayerTo } from '~system/RestrictedActions'
import { height, sceneSizeX, sceneSizeZ } from '../resources'
import { ensureGameController } from '..'
import { zombieKiller } from '../systems/zombieKiller'

const ZOMBIE_MODEL_PATH = 'models/zombie.glb'
const ATTACK_DISTANCE = 2
const MOVEMENT_SPEED = 4
const ROTATION_SPEED = 1


export function createZombie(position: Vector3) {
  const zombie = engine.addEntity()
  Transform.create(zombie, {
    position
  })
  GltfContainer.create(zombie, {
    src: ZOMBIE_MODEL_PATH
  })
  ZombieComponent.create(zombie)
  Animator.create(zombie, {
    states: [
      {
        name: 'Walking',
        clip: 'Walking',
        playing: true,
        loop: true
      },
      {
        name: 'Attacking',
        clip: 'Attacking',
        loop: true
      }
    ]
  })
  Zombie.create(zombie, {
    movementSpeed: MOVEMENT_SPEED,
    rotationSpeed: ROTATION_SPEED
  })

  //const xPos = 60 + Math.random() * 10

  MoveTransformComponent.create(zombie, {
    start: { x: 80, y: 5, z: 40 },
    duration: 2,
    normalizedTime: 2,
    lerpTime: 0.5,
    speed: 0.09,
    interpolationType: 1
  })

  PointerEvents.create(zombie, {
    pointerEvents: [
    {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_POINTER,
          maxDistance: 36,
      hoverText: "THROW ROCK"
        }
      }
    ]
  })
}



function zombieMovementSystem(deltaTime: number) {
  if (!Transform.has(engine.PlayerEntity)) return
  const playerPos = Transform.get(engine.PlayerEntity).position

  for (const [entity] of engine.getEntitiesWith(Zombie)) {
    const transform = Transform.getMutable(entity)

    // Rotate to face player
    const lookAtTarget = Vector3.create(playerPos.x, transform.position.y, playerPos.z)
    const lookAtDirection = Vector3.subtract(lookAtTarget, transform.position)
    transform.rotation = Quaternion.slerp(
      transform.rotation,
      Quaternion.lookRotation(lookAtDirection),
      ROTATION_SPEED + deltaTime
    )

    // Move towards player until it's at attack distance
    const distance = Vector3.distanceSquared(transform.position, playerPos) // Check distance squared as it's more optimized

    const isInAttackDistance = distance < ATTACK_DISTANCE
    if (!isInAttackDistance) {
      const forwardVector = Vector3.rotate(Vector3.Forward(), transform.rotation)
      const positionDelta = Vector3.scale(forwardVector, MOVEMENT_SPEED * deltaTime)
      transform.position = Vector3.add(transform.position, positionDelta)
    }

    if (isInAttackDistance) {
      console.log('eaten by zombie', entity)
      ensureGameController().livesLeft -= 1
      movePlayerTo({ newRelativePosition: Vector3.create(sceneSizeX / 2, height / 2 + 2, 113) })
      //zombieKiller()
      MoveTransformComponent.deleteFrom(entity)
      MoveTransformFinishedComponent.create(entity)
    }


    Animator.getClip(entity, 'Walking').playing = !isInAttackDistance
    Animator.getClip(entity, 'Attacking').playing = isInAttackDistance
  }
}
engine.addSystem(zombieMovementSystem)
