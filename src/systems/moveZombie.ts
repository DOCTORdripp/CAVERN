import { MoveTransformComponent, MoveTransformFinishedComponent } from '../components/moveTransport'
import { ZombieComponent } from '../components/zombie'
import { playSound } from '../factory/sound'
import { ensureGameController } from '..'
import { Interpolate } from '../helper/interpolation'
import { engine, Transform, Animator, NftShape } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export function moveSystem(dt: number) {
  for (const [entity] of engine.getEntitiesWith(MoveTransformComponent, Transform, ZombieComponent)) {
    const move = MoveTransformComponent.getMutable(entity)
    const transform = Transform.getMutable(entity)

    move.normalizedTime = Math.min(Math.max(move.normalizedTime + dt * move.speed, 0), 1)
    move.lerpTime = Interpolate(move.interpolationType, move.normalizedTime)

   // const playerPos = Transform.get(engine.PlayerEntity).position
    // assign value to transform
    //transform.position = move.start;

    const hasFinished = move.normalizedTime >= 10000
    if (hasFinished) {
      MoveTransformComponent.deleteFrom(entity)
      MoveTransformFinishedComponent.create(entity)
    }
  }

  for (const [zombieEntity] of engine.getEntitiesWith(MoveTransformFinishedComponent, Transform, ZombieComponent)) {
    console.log('finished zombiez', zombieEntity)
    ensureGameController().livesLeft -= 1

    const animator = Animator.getMutable(zombieEntity)
    const walkAnim = Animator.getClip(zombieEntity, 'Walking')
    const attackAnim = Animator.getClip(zombieEntity, 'Attacking')
    if (walkAnim && attackAnim) {
      walkAnim.playing = false
      walkAnim.loop = false
      attackAnim.playing = true
      attackAnim.loop = true
    }

    const nfts = engine.getEntitiesWith(NftShape)

    //only remove first
    for (const [entity] of nfts) {
      engine.removeEntity(entity)
      break
    }

    playSound(zombieEntity, 'sounds/attack.mp3', true)
    MoveTransformFinishedComponent.deleteFrom(zombieEntity)
  }
}
