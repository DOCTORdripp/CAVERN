import { Entity, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { create, followPath, talk } from 'dcl-npc-toolkit'
import { FollowPathData, NPCType } from 'dcl-npc-toolkit/dist/types'
import { dogeDialog } from './dialogs'

let doge: Entity

export function createDogeNpc() {
  let dogePathPoints = [
    Vector3.create(95, 96.5, 111),
    Vector3.create(96, 96.5, 112)
  ]
  let dogePath: FollowPathData = {
    path: dogePathPoints,
    totalDuration: dogePathPoints.length * 6,
    loop: true
    // curve: true,
  }

  doge = create(
    {
      position: Vector3.clone(dogePathPoints[0]),
      scale: Vector3.create(1, 1, 1)
    },
    {
      type: NPCType.CUSTOM,
      model: 'models/dogeNPC_anim4.glb', //'models/robots/marsha.glb',//'models/Placeholder_NPC_02.glb',
      onActivate: () => {
        console.log('doge.NPC activated!')
        talk(doge, dogeDialog)
      },
      onWalkAway: () => {
        console.log('NPC', 'Doge', 'on walked away')
        followPath(doge, dogePath)
      },
      idleAnim: 'Idle',
      walkingAnim: 'Walk',
      faceUser: true, //continue to face user???
      portrait: {
        path: 'images/doge.png',
        height: 300,
        width: 300,
        offsetX: -50,
        offsetY: 0,
        section: { sourceHeight: 256, sourceWidth: 256 }
      },
      darkUI: true,
      coolDownDuration: 3,
      hoverText: 'ASK FOR DIRECTIONS',
      onlyETrigger: true,
      onlyClickTrigger: false,
      onlyExternalTrigger: false,
      reactDistance: 5,
      continueOnWalkAway: false
      //dialogCustomTheme: RESOURCES.textures.dialogAtlas,
    }
  )
  followPath(doge, dogePath)
}
