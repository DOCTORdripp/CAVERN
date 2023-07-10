import { AudioSource, engine, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { createSound } from './sound'
import * as utils from '@dcl-sdk/utils'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { questioning } from './dialogs'
import * as npc from 'dcl-npc-toolkit'
import { marsha2, marsha3, electricity, indicatorArrowTeal, indicatorArrowTeal2, indicatorArrowTeal3 } from '.'

/**
 * Sound is a separated from the card entity so that you can
 * still hear it even when the card is removed from the engine.
 */
const cardPickupSound = createSound('sounds/cardPickup.mp3')

export function createCard(position: Vector3, gltfSrc: string, scale: Vector3) {
  const entity = engine.addEntity()

  Transform.create(entity, { position, scale })
  GltfContainer.create(entity, { src: gltfSrc })

  utils.triggers.oneTimeTrigger(entity, 1, 1, [{ type: 'box', position: Vector3.create(0, 0.75, 0), scale: Vector3.create(2,5,2) }], () => {
    Transform.getMutable(entity).scale = Vector3.Zero()
    AudioSource.getMutable(cardPickupSound).playing = true
    AudioSource.getMutable(electricity).playing = true
    engine.removeEntity(entity)
    engine.removeEntity(marsha2)
    engine.removeSystem(SimpleRotate)
    console.log('ancient power obtained')
    Transform.getMutable(marsha3).scale = Vector3.create(2, 2, 2);
    Transform.getMutable(marsha3).position = Vector3.create(2.5, 14, 39);
    npc.talk(marsha3, questioning)
    Transform.getMutable(indicatorArrowTeal).scale = Vector3.create(0,0,0);
    Transform.getMutable(indicatorArrowTeal2).scale = Vector3.create(0,0,0);
    Transform.getMutable(indicatorArrowTeal3).scale = Vector3.create(0,0,0);
  })

  function SimpleRotate() {
    let transform = Transform.getMutable(entity)
    transform.rotation = Quaternion.multiply(transform.rotation, Quaternion.fromAngleAxis(30, Vector3.Down()))
  }
  
  engine.addSystem(SimpleRotate)
}
