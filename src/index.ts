import { createCard } from './card'
import { createPowerBase } from './powerBase'
import { createPowerCube } from './powerCube'
import { movePlayerTo } from '~system/RestrictedActions'
import { Quaternion, Vector3, Color4 } from '@dcl/sdk/math'
import { height, sceneSizeX, sceneSizeZ, radiusMultiplier } from './resources'
import { GameControllerComponent } from './components/gameController'
import { createNft } from './factory/nft'
import { moveSystem } from './systems/moveZombie'
import { zombieKiller } from './systems/zombieKiller'
import { createZombie} from './modules/zombie'
import * as utils from '@dcl-sdk/utils'
import { togglePower } from './powerBase'
import { VisibilityComponent } from '@dcl/sdk/ecs'
import * as npc from 'dcl-npc-toolkit'
import { setupUi, toggleMenuVisibility } from './setupUI'
import { testscript, uncle2, uncleFinale, callingHelp, beatGame, fightComplete } from './dialogs'
import { createDogeNpc } from './dogeNpc'
import { AudioSource, engine, GltfContainer, InputAction, PointerEvents, PointerEventType, Transform, 
  MeshCollider, Material, MeshRenderer, pointerEventsSystem, NftShape } from '@dcl/sdk/ecs'

// LOAD FIRST - HIGH PRIORITY

// Opening Scene - Fit Through Cave Teleport
const clickableEntity2 = engine.addEntity()
MeshRenderer.setBox(clickableEntity2)
MeshCollider.setBox(clickableEntity2)
VisibilityComponent.createOrReplace(clickableEntity2, { visible: false });
Transform.create(clickableEntity2, { position: Vector3.create(21, 3.5, -8), scale: Vector3.Zero() })

const cavePortal = engine.addEntity()
GltfContainer.create(cavePortal, { src: 'models/cavePortal.glb' })
Transform.create(cavePortal, { position: Vector3.create(13, 1, -10),  rotation: Quaternion.fromEulerDegrees(0, -10, -10),  scale: Vector3.create(0.8, 0.8, 0.8) })

const cavePortalBeatGame = engine.addEntity()
GltfContainer.create(cavePortalBeatGame, { src: 'models/cavePortalClosed.glb' })
Transform.create(cavePortalBeatGame, { position: Vector3.create(13, 1, -10),  rotation: Quaternion.fromEulerDegrees(0, -10, -10),  scale: Vector3.Zero() })

const cavePortalEnvironment = engine.addEntity()
GltfContainer.create(cavePortalEnvironment, { src: 'models/cavePortalEnvironment.glb' })
Transform.create(cavePortalEnvironment, { position: Vector3.create(18, -1.7, -10),  scale: Vector3.create(1, 1, 1) })

pointerEventsSystem.onPointerDown(
  {
    entity: clickableEntity2, opts: {
      button: InputAction.IA_POINTER,
      hoverText: 'SQUEEZE THRU SMALL HOLE',
      maxDistance: 15
    }
  }
  ,
  function () {
    movePlayerTo({ newRelativePosition: Vector3.create(sceneSizeX / 2, height / 2 + 2, 110),
    cameraTarget: Vector3.create(60, 90, 110) })
    togglePower(true)
  }
)

export let stuckDoge = npc.create(
  {
    position: Vector3.create(18, 4.5, -8.5),
    rotation: Quaternion.fromEulerDegrees(120, 90, 0),
    scale: Vector3.create(4, 4, 4)
  },
  {
    type: npc.NPCType.CUSTOM,
    model: {
      src: 'models/dogeNPC_anim4.glb'
    },
    hoverText: 'PUSH STUCK DOGE',
    idleAnim:  'Walk',
    onlyClickTrigger: true,
    portrait: { path: 'images/doge.png' },
    onActivate: () => {
      engine.removeEntity(stuckDoge)
      Transform.getMutable(clickableEntity2).scale = Vector3.create(4, 4, 4);
    }
  }
)

//Call for Help zone
const helpZone = utils.addTestCube(
   { position: {x: 1, y: 6, z: 1}, scale: {x: 1, y: 1, z: 1}},
   undefined, undefined, undefined, undefined,
   true
 )

utils.triggers.oneTimeTrigger(helpZone, utils.NO_LAYERS, utils.LAYER_1, [{type: 'box', position: {x: -20, y: 2, z: -16}, scale: {x: 20, y: 1, z: 20}}], function(otherEntity) {
  console.log(`You hear someone calling for help`)
  npc.talk(stuckDoge,callingHelp)
})

//Elevated platform
let elevatedPlatform = engine.addEntity()
Transform.create(elevatedPlatform, {
  position: Vector3.create(sceneSizeX / 2, height / 2, 105),
  scale: Vector3.create(1.2, 1.2, 1.2),
  rotation: Quaternion.fromEulerDegrees(0, -10, 0),
})
GltfContainer.create(elevatedPlatform, { src: 'models/woodBridge.glb' })

//Elevated treeWalls
                   //treeWall6
                   const treeWall6 = engine.addEntity()
                   GltfContainer.create(treeWall6, { src: 'models/treeWall.glb' })
                   Transform.create(treeWall6, {
                    position: Vector3.create(92, 97, 106),
                     scale: Vector3.create(0.8, 0.8, 0.8),
                     rotation: Quaternion.fromEulerDegrees(0, 80, 0)
                   }) 
                   //treeWall7
                   const treeWall7 = engine.addEntity()
                   GltfContainer.create(treeWall7, { src: 'models/treeWall.glb' })
                   Transform.create(treeWall7, {
                    position: Vector3.create(91, 97, 116.3),
                     scale: Vector3.create(-.8, .8, .8),
                     rotation: Quaternion.fromEulerDegrees(0, 90, 0)
                   }) 
                   //treeWall8
                   const treeWall8 = engine.addEntity()
                   GltfContainer.create(treeWall8, { src: 'models/treeWall.glb' })
                   Transform.create(treeWall8, {
                    position: Vector3.create(101, 97, 110),
                     scale: Vector3.create(.8, .8, .8),
                     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
                   })                                     
                   //treeWall9
                   export const treeWall9 = engine.addEntity()
                   GltfContainer.create(treeWall9, { src: 'models/treeWall.glb' })
                   Transform.create(treeWall9, {
                    position: Vector3.create(90, 96.5, 110),
                     scale: Vector3.create(-.8, .8, .8),
                     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
                   })  

            //doorClosed
            export const doorClosed = engine.addEntity()
            GltfContainer.create(doorClosed, { src: 'models/door.glb' })
            Transform.create(doorClosed, {
              position: Vector3.create(12, -0.3, 30),
              scale: Vector3.Zero()
            })   
            
            //secretUncleExit
            const secretTunnel = utils.addTestCube(
               { position: {x: 1, y: 5, z: 1}, scale: {x: 1, y: 1, z: 1}},
               undefined, undefined, undefined, undefined,
               true
             )
            
            utils.triggers.addTrigger(secretTunnel, utils.NO_LAYERS, utils.LAYER_1, [{type: 'box', position: {x: -1, y: 10, z: 39}, scale: {x: 1, y: 1, z: 1}}], function(otherEntity) {
              console.log(`Sneak out the back`)
              movePlayerTo({ newRelativePosition: Vector3.create(12,15,39) })
            })            

//zombieCaveGate
export const zombieCaveGate = engine.addEntity()
GltfContainer.create(zombieCaveGate, {src: 'models/zombieCaveGate.glb'})
Transform.create(zombieCaveGate,{
  position: Vector3.create(63, 5, 36),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, -10, 0)})                   

//exit
export const clickableEntity = engine.addEntity()
MeshRenderer.setBox(clickableEntity)
MeshCollider.setBox(clickableEntity)
VisibilityComponent.createOrReplace(clickableEntity, { visible: false });
Transform.create(clickableEntity, { position: Vector3.create(87, 3, 35), scale: Vector3.Zero() })

pointerEventsSystem.onPointerDown(
  {
    entity: clickableEntity, opts: {
      button: InputAction.IA_POINTER,
      hoverText: 'ESCAPE TO SURFACE'
    }
  }
  ,
  function () {
    movePlayerTo({ newRelativePosition: Vector3.create(-6, 22, -10),
      cameraTarget: Vector3.create(20, 60, 10) });
    engine.removeEntity(cavePortal);
    Transform.getMutable(cavePortalBeatGame).scale = Vector3.create(0.8, 0.8, 0.8);
    Transform.getMutable(prizeBoard).scale = Vector3.create(1.5, 1.5, 1.5);
    npc.talk(stuckDoge, beatGame)
    Transform.getMutable(indicatorArrowGreen).scale = Vector3.Zero();
  }
)


//ZOMBIE SHOOTER
//GAME CONFIG

const _LIVES = 2
const _WINNING_SCORE = 3
const _SPAWN_INTERVAL = 2

const gameEntity = engine.addEntity()

export function triggerGameStart() {
  const gameController = ensureGameController()

  if (gameController.spawnActive) {
    gameController.spawnActive = true
    gameController.livesLeft = _LIVES
    gameController.score = 0

    // clear NFTs
    const nfts = engine.getEntitiesWith(NftShape)
    for (const [entity, _nftShape] of nfts) {
      engine.removeEntity(entity)
    }

    for (let i = _LIVES; i >= 0; i--) {
      createNft(i)
    }
    return
  }

  Object.assign(gameController, {
    spawnActive: true,
    livesLeft: _LIVES,
    score: 0,
    spawnCountDown: 0,
    spawnInterval: _SPAWN_INTERVAL,
    winningScore: _WINNING_SCORE,
    maxZombies: 10
  })

  for (let i = _LIVES; i >= 0; i--) {
    createNft(i)
  }

  if (AudioSource.has(gameEntity)) {
    const source = AudioSource.getMutable(gameEntity)
    source.playing = true
  } else {
    AudioSource.create(gameEntity, {
      audioClipUrl: '/sounds/ambient.mp3',
      loop: true,
      playing: true
    })
  }
}

// Static Uncle - Completed Fight

export let marsha2 = npc.create(
  {
    position: Vector3.create(6, 84, 39),
    rotation: Quaternion.fromEulerDegrees(0, 140, 0),
    scale: Vector3.create(0, 0, 0)
  },
  {
    type: npc.NPCType.CUSTOM,
    model: {
      src: 'models/dogeNPC_anim4.glb'
    },
    faceUser: true,
    reactDistance: 3,
    portrait: { path: 'images/doge.png' },
    onActivate: () => {
      npc.talk(marsha2, uncle2)
    },
    onWalkAway: () => {
      console.log('test on walk away function')
      npc.closeDialogWindow(marsha2)
    }
  }
)

// Static Uncle - Completed Relic

export let marsha3 = npc.create(
  {
    position: Vector3.create(4.5, 84, 39),
    rotation: Quaternion.fromEulerDegrees(0, 140, 0),
    scale: Vector3.create(0, 0, 0)
  },
  {
    type: npc.NPCType.CUSTOM,
    model: {
      src: 'models/dogeNPC_anim4.glb'
    },
    faceUser: true,
    reactDistance: 3,
    portrait: { path: 'images/doge.png' },
    onActivate: () => {
      npc.talk(marsha3, uncleFinale)
    },
    onWalkAway: () => {
      console.log('test on walk away function')
      npc.closeDialogWindow(marsha3)
    }
  }
)

//MAIN

export function main() {
  // Base
  const staticBase = engine.addEntity()
  GltfContainer.create(staticBase, { src: 'models/staticBase.glb' })
  Transform.create(staticBase, {
    position: Vector3.create(0, 0, 1),
    scale: Vector3.create(6,1,8)
  })
  PointerEvents.create(staticBase, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          showFeedback: true
        }
      }
    ]
  })

  //planterEmpty
  const staticPlanter = engine.addEntity()
  GltfContainer.create(staticPlanter, { src: 'models/relicEmpty.glb' })
  Transform.create(staticPlanter, {
    position: Vector3.create(41, 0.3, 64),
    scale: Vector3.create(1,1,1)
  })

    //planter2
    const staticPlanterLeft = engine.addEntity()
    GltfContainer.create(staticPlanterLeft, { src: 'models/relic2.glb' })
    Transform.create(staticPlanterLeft, {
      position: Vector3.create(10, 0.3, 64),
      scale: Vector3.create(0.75,0.75,0.75)
    })

        //planter3
        const staticPlanterRight = engine.addEntity()
        GltfContainer.create(staticPlanterRight, { src: 'models/relic2.glb' })
        Transform.create(staticPlanterRight, {
          position: Vector3.create(90, 0.3, 64),
          scale: Vector3.create(-.75,0.75,.75)
        })

            //planterMaze
    const staticPlanterMaze = engine.addEntity()
    GltfContainer.create(staticPlanterMaze, { src: 'models/relic3.glb' })
    Transform.create(staticPlanterMaze, {
      position: Vector3.create(48, 0.25, 102),
      scale: Vector3.create(.75,.75,.75)
    })

    if (Math.random() <= 0.5) {
      Transform.getMutable(staticPlanterMaze).scale = Vector3.create(-.75,.75,.75);
    } else {
      // paste any actions that occur other 50% of the time
    }

          //bridgeTop
  const staticBridgeTop = engine.addEntity()
  GltfContainer.create(staticBridgeTop, { src: 'models/landbridge.glb' })
  Transform.create(staticBridgeTop, {
    position: Vector3.create(60, 70, 110),
    scale: Vector3.create(1,1,1)
  })

  const staticBridgeTopC = engine.addEntity()
  GltfContainer.create(staticBridgeTopC, { src: 'models/landbridge.glb' })
  Transform.create(staticBridgeTopC, {
    position: Vector3.create(10, 45, 75),
    scale: Vector3.create(1,1,1),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })

  //woodBridge
  const staticBridgeWood = engine.addEntity()
  GltfContainer.create(staticBridgeWood, { src: 'models/woodBridge.glb' })
  Transform.create(staticBridgeWood, {
    position: Vector3.create(20, 65, 120),
    scale: Vector3.create(1,1,1),
    rotation: Quaternion.fromEulerDegrees(0, 180, 0)
  })

    //woodBridge2
    const staticBridgeWood2 = engine.addEntity()
    GltfContainer.create(staticBridgeWood2, { src: 'models/woodBridge.glb' })
    Transform.create(staticBridgeWood2, {
      position: Vector3.create(69, 27, 3),
      scale: Vector3.create(1,1,1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })

        //woodBridge3
        const staticBridgeWood3 = engine.addEntity()
        GltfContainer.create(staticBridgeWood3, { src: 'models/woodBridge.glb' })
        Transform.create(staticBridgeWood3, {
          position: Vector3.create(16, 12, 30),
          scale: Vector3.create(1,1,1),
          rotation: Quaternion.fromEulerDegrees(0, 0, 0)
        })

    //woodBridgeLong
    const staticBridgeWoodLong = engine.addEntity()
    GltfContainer.create(staticBridgeWoodLong, { src: 'models/woodBridgeLong.glb' })
    Transform.create(staticBridgeWoodLong, {
      position: Vector3.create(32, 32, 35),
      scale: Vector3.create(4,4,4),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    })

    const staticBridgeWoodLong2 = engine.addEntity()
    GltfContainer.create(staticBridgeWoodLong2, { src: 'models/woodBridgeLong.glb' })
    Transform.create(staticBridgeWoodLong2, {
      position: Vector3.create(52, 12.5, 20),
      scale: Vector3.create(4,4,4),
      rotation: Quaternion.fromEulerDegrees(0, -90, 0)
    })

  

          //safehouse
  const safeHouse = engine.addEntity()
  GltfContainer.create(safeHouse, { src: 'models/safeHouse.glb' })
  Transform.create(safeHouse, {
    position: Vector3.create(12, -0.3, 30),
    scale: Vector3.create(-1,1,1)
  })

            //safeland
            const safeLand = engine.addEntity()
            GltfContainer.create(safeLand, { src: 'models/safeLandSlant.glb' })
            Transform.create(safeLand, {
              position: Vector3.create(49, -0.3, 30),
              scale: Vector3.create(1,1,1)
            })
  
              //safeland2
              const safeLand2 = engine.addEntity()
              GltfContainer.create(safeLand2, { src: 'models/safeLandSlant.glb' })
              Transform.create(safeLand2, {
                position: Vector3.create(84, -0.3, 30),
                scale: Vector3.create(-1,1,1)
              })
                //safeland3
                const safeLand3 = engine.addEntity()
                GltfContainer.create(safeLand3, { src: 'models/safeLandSlant.glb' })
                Transform.create(safeLand3, {
                  position: Vector3.create(0, -0.6, 60),
                  scale: Vector3.create(-1,1,1)
                })    
                //safeland4
                const safeLand4 = engine.addEntity()
                GltfContainer.create(safeLand4, { src: 'models/safeLandSlant.glb' })
                Transform.create(safeLand4, {
                  position: Vector3.create(96, -0.6, 60),
                  scale: Vector3.create(1,1,1)
                })   

                //zombieCave
              const zombieCave = engine.addEntity()
              GltfContainer.create(zombieCave, { src: 'models/zombieCave.glb' })
              Transform.create(zombieCave, {
                position: Vector3.create(63, 5, 37),
                scale: Vector3.create(1,1,1),
                rotation: Quaternion.fromEulerDegrees(0, -10, 0)
              })           
              
                 //palmTrees0
                 const palmTrees0 = engine.addEntity()
                 GltfContainer.create(palmTrees0, { src: 'models/palmTrees.glb' })
                 Transform.create(palmTrees0, {
                   position: Vector3.create(68, -0.6, 50),
                   scale: Vector3.create(1.2,1.2,1.2)
                 })    
                 
                   //palmTrees1
                   const palmTrees1 = engine.addEntity()
                   GltfContainer.create(palmTrees1, { src: 'models/palmTrees.glb' })
                   Transform.create(palmTrees1, {
                     position: Vector3.create(83, 1, 38),
                     scale: Vector3.create(-1.2,1.2,-1.2),
                     rotation: Quaternion.fromEulerDegrees(20, 80, 0)
                   })                  
                 //palmTrees2
                 const palmTrees2 = engine.addEntity()
                 GltfContainer.create(palmTrees2, { src: 'models/palmTrees.glb' })
                 Transform.create(palmTrees2, {
                   position: Vector3.create(5, 0, 55),
                   scale: Vector3.create(-1.2,1.2,1.2),
                   rotation: Quaternion.fromEulerDegrees(0, 60, 0)
                 }) 

                  //palmTrees3
                  const palmTrees3 = engine.addEntity()
                  GltfContainer.create(palmTrees3, { src: 'models/palmTrees.glb' })
                  Transform.create(palmTrees3, {
                    position: Vector3.create(36, -0.6, 50),
                    scale: Vector3.create(1.2,1.2,1.2)
                  })                    

                   //palmTrees4
                   const palmTrees4 = engine.addEntity()
                   GltfContainer.create(palmTrees4, { src: 'models/palmTrees.glb' })
                   Transform.create(palmTrees4, {
                     position: Vector3.create(64, -0.6, 20),
                     scale: Vector3.create(0.9,0.9,0.9),
                     rotation: Quaternion.fromEulerDegrees(0, -60, 0)
                   })  

                   //treeWall0
                   const treeWall0 = engine.addEntity()
                   GltfContainer.create(treeWall0, { src: 'models/treeWall.glb' })
                   Transform.create(treeWall0, {
                     position: Vector3.create(0, 1, 60),
                     scale: Vector3.create(1.5,1.5,1.5),
                     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
                   })                    
                   
                   //treeWall
                   const treeWall = engine.addEntity()
                   GltfContainer.create(treeWall, { src: 'models/treeWall.glb' })
                   Transform.create(treeWall, {
                     position: Vector3.create(15, 1.5, 50),
                     scale: Vector3.create(1.5,1.5,1.5),
                     rotation: Quaternion.fromEulerDegrees(0, -90, 0)
                   })    
                   
                     //treeWall2
                     const treeWall2 = engine.addEntity()
                     GltfContainer.create(treeWall2, { src: 'models/treeWall.glb' })
                     Transform.create(treeWall2, {
                       position: Vector3.create(40, 1.5, 50),
                       scale: Vector3.create(1.5,1.5,1.5),
                       rotation: Quaternion.fromEulerDegrees(0, -90, 0)
                     })     
                     
                     //treeWall3
                     const treeWall3 = engine.addEntity()
                     GltfContainer.create(treeWall3, { src: 'models/treeWall.glb' })
                     Transform.create(treeWall3, {
                       position: Vector3.create(94, 1.5, 50),
                       scale: Vector3.create(-1.5,1.5,1.5),
                       rotation: Quaternion.fromEulerDegrees(0, -90, 0)
                     })    
                     
                       //treeWall4
                       const treeWall4 = engine.addEntity()
                       GltfContainer.create(treeWall4, { src: 'models/treeWall.glb' })
                       Transform.create(treeWall4, {
                         position: Vector3.create(75, 1.5, 50),
                         scale: Vector3.create(-1.5,1.5,1.5),
                         rotation: Quaternion.fromEulerDegrees(0, -90, 0)
                       })  
                       
                   //treeWall5
                   const treeWall5 = engine.addEntity()
                   GltfContainer.create(treeWall5, { src: 'models/treeWall.glb' })
                   Transform.create(treeWall5, {
                     position: Vector3.create(98, 1, 63),
                     scale: Vector3.create(-1.8,1.8,1.8),
                     rotation: Quaternion.fromEulerDegrees(0, 0, 0)
                   })                        
                       
                     //stairCase
                     const stairCase = engine.addEntity()
                     GltfContainer.create(stairCase, { src: 'models/stairCase.glb' })
                     Transform.create(stairCase, {
                       position: Vector3.create(51, 0.3, 48),
                       scale: Vector3.create(1.5,1.5,-1.5),
                       rotation: Quaternion.fromEulerDegrees(0, 0, 0)
                     })      
                     
                                        

  // Scene objects
  ////createCard is a great example of exported function
  createCard(Vector3.create(48, 20, 106), 'models/bathWater.glb', Vector3.create(1, 1, 1)) //key

  const GROUND_HEIGHT = 3.4

  createPowerBase(Vector3.create(96, 0.024, 33), 'models/powerBase.glb', Vector3.create(5.5,1,7.5))


//NPCs
// Static Uncle 
let marsha = npc.create(
  {
    position: Vector3.create(6, 14, 39),
    rotation: Quaternion.fromEulerDegrees(0, 140, 0),
    scale: Vector3.create(2, 2, 2)
  },
  {
    type: npc.NPCType.CUSTOM,
    model: {
      src: 'models/dogeNPC_anim4.glb'
    },
    faceUser: true,
    reactDistance: 3,
    portrait: { path: 'images/doge.png' },
    onActivate: () => {
      npc.talk(marsha, testscript)
    },
    onWalkAway: () => {
      console.log('test on walk away function')
      npc.closeDialogWindow(marsha)
    }
  }
)

// walking NPC
createDogeNpc()

setupUi()  

//#region SkyBox
const folderNumber = "7"

//root
let skyboxRoot = engine.addEntity()
Transform.create(skyboxRoot, { position: Vector3.create(48, 52.8, 64) })

//front
let skyboxPZ = engine.addEntity()
Transform.create(skyboxPZ, {
  position: Vector3.create(0, 0, sceneSizeZ / 2 * radiusMultiplier),
  scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
  parent: skyboxRoot
})
MeshCollider.setPlane(skyboxPZ)
MeshRenderer.setPlane(skyboxPZ)
Material.setBasicMaterial(skyboxPZ, {
  texture: Material.Texture.Common({
    src: "images/skybox/" + folderNumber + "/pz.png"
  })
})

//back
let skyboxNZ = engine.addEntity()
Transform.create(skyboxNZ, {
  position: Vector3.create(0, 0, -sceneSizeZ / 2 * radiusMultiplier),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0),
  scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
  parent: skyboxRoot
})
MeshCollider.setPlane(skyboxNZ)
MeshRenderer.setPlane(skyboxNZ)
Material.setBasicMaterial(skyboxNZ, {
  texture: Material.Texture.Common({
    src: "images/skybox/" + folderNumber + "/nz.png"
  })
})

//Top
let skyboxPY = engine.addEntity()
Transform.create(skyboxPY, {
  position: Vector3.create(0, height / 2 * radiusMultiplier, 0),
  rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
  scale: Vector3.create(sceneSizeX * radiusMultiplier, 106, sceneSizeZ * radiusMultiplier),
  parent: skyboxRoot
})
MeshCollider.setPlane(skyboxPY)
MeshRenderer.setPlane(skyboxPY)
Material.setBasicMaterial(skyboxPY, {
  texture: Material.Texture.Common({
    src: "images/skybox/" + folderNumber + "/py.png"
  })
})

//Bottom
let skyboxNY = engine.addEntity()
Transform.create(skyboxNY, {
  position: Vector3.create(0, -height / 2 * radiusMultiplier, 0),
  rotation: Quaternion.fromEulerDegrees(90, 0, 0),
  scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
  parent: skyboxRoot
})
MeshCollider.setPlane(skyboxNY)
MeshRenderer.setPlane(skyboxNY)
Material.setBasicMaterial(skyboxNY, {
  texture: Material.Texture.Common({
    src: "images/skybox/" + folderNumber + "/ny.png"
  })
})

//Right
let skyboxPX = engine.addEntity()
Transform.create(skyboxPX, {
  position: Vector3.create(sceneSizeX / 2 * radiusMultiplier, 0, 0),
  rotation: Quaternion.fromEulerDegrees(0, 90, 0),
  scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
  parent: skyboxRoot
})
MeshCollider.setPlane(skyboxPX)
MeshRenderer.setPlane(skyboxPX)
Material.setBasicMaterial(skyboxPX, {
  texture: Material.Texture.Common({
    src: "images/skybox/" + folderNumber + "/px.png"
  })
})

// Left
let skyboxNX = engine.addEntity()
Transform.create(skyboxNX, {
  position: Vector3.create(-sceneSizeX / 2 * radiusMultiplier, 0, 0),
  rotation: Quaternion.fromEulerDegrees(0, -90, 0),
  scale: Vector3.create(sceneSizeX * radiusMultiplier, height * radiusMultiplier, sceneSizeZ * radiusMultiplier),
  parent: skyboxRoot
})
MeshCollider.setPlane(skyboxNX)
MeshRenderer.setPlane(skyboxNX)
Material.setBasicMaterial(skyboxNX, {
  texture: Material.Texture.Common({
    src: "images/skybox/" + folderNumber + "/nx.png"
  })
})
//#endregion

//KERSPLAT

// Create a box with disabled collision
const kerSplat = utils.addTestCube(
 // { position: {x: 50, y: 20, z: 90}, scale: {x: 90, y: 1, z: 90} },
  { position: {x: 1, y: 3, z: 1}, scale: {x: 1, y: 1, z: 1} },
  undefined, undefined, undefined, undefined,
  true
)

const kerSplat1 = utils.addTestCube(
  // { position: {x: 50, y: 20, z: 90}, scale: {x: 90, y: 1, z: 90} },
   { position: {x: 45, y: 32, z: 85}, scale: {x: 120, y: 1, z: 110} },
   undefined, undefined, undefined, undefined,
   false
 )
 VisibilityComponent.createOrReplace(kerSplat1, { visible: false });

const kerSplat2 = utils.addTestCube(
  // { position: {x: 50, y: 20, z: 90}, scale: {x: 90, y: 1, z: 90} },
   { position: {x: 1, y: 4, z: 1}, scale: {x: 1, y: 1, z: 1}},
   undefined, undefined, undefined, undefined,
   true
 )

utils.triggers.addTrigger(kerSplat, utils.NO_LAYERS, utils.LAYER_1, [{type: 'box', position: {x: 45, y: 31, z: 95}, scale: {x: 110, y: 1, z: 120}}], function(kersplatMain) {
  console.log(`KERSPLAT! Try Again!`)
  movePlayerTo({ newRelativePosition: Vector3.create(sceneSizeX / 2, height / 2 + 2, 113),
  cameraTarget: Vector3.create(6, 90, 110) })
  toggleMenuVisibility()
  console.log('visilibity toggled')
  AudioSource.getMutable(death).playing = true;
})

// Double first trigger zone in case first one fails
utils.triggers.addTrigger(kerSplat1, utils.NO_LAYERS, utils.LAYER_1, [{type: 'box', position: {x: 45, y: 28, z: 95}, scale: {x: 110, y: 1, z: 120}}], function(kersplatBackup) {
  console.log(`KERSPLAT! Try Again!`)
  movePlayerTo({ newRelativePosition: Vector3.create(sceneSizeX / 2, height / 2 + 2, 113),
  cameraTarget: Vector3.create(6, 90, 110) })
  toggleMenuVisibility()
  console.log('visilibity toggleded')
  AudioSource.getMutable(death).playing = true;
})

utils.triggers.addTrigger(kerSplat2, utils.NO_LAYERS, utils.LAYER_1, [{type: 'box', position: {x: 25, y: 22, z: 26}, scale: {x: 90, y: 1, z: 30}}], function(kersplatBottom) {
  console.log(`KERSPLAT!! Stay on the path!`)
  movePlayerTo({ newRelativePosition: Vector3.create(sceneSizeX / 2, height / 2 + 2, 113),
  cameraTarget: Vector3.create(6, 90, 110) })
  AudioSource.getMutable(death).playing = true;
})



//ZOMBIE SHOOTER
//CODE


function spawnZombie() {
  const xPos = 48 + Math.random() * 10
  //return createZombie(xPos)
  return createZombie(Vector3.create(65, 6, 38.5))
}


function lose() {
  console.log('GAME OVER!!')
  endGame()
  movePlayerTo({ newRelativePosition: Vector3.create(sceneSizeX / 2, height / 2 + 2, 113),
  cameraTarget: Vector3.create(6, 90, 110) })
}

function win() {
  AudioSource.getMutable(hammer).playing = true;
  Transform.getMutable(zombieCaveGate).scale = Vector3.One();
  console.log('YOU WIN!!')
  endGame()
  engine.removeEntity(marsha)
  Transform.getMutable(marsha2).scale = Vector3.create(2, 2, 2);
  Transform.getMutable(marsha2).position = Vector3.create(4, 14, 39);
  npc.talk(marsha2, fightComplete)
}

function endGame() {
  ensureGameController().spawnActive = false

  if (AudioSource.has(gameEntity)) {
    AudioSource.getMutable(gameEntity).playing = false
  }
}

function gameLogicSystem(dt: number) {
  const gameController = ensureGameController()

  if (gameController.spawnActive) {
    if (gameController.livesLeft <= 0) {
      lose()
    } else if (gameController.score >= gameController.winningScore) {
      win()
    }

    gameController.spawnCountDown -= dt
    if (gameController.spawnCountDown < 0) {
      gameController.spawnCountDown = gameController.spawnInterval
      const zombie = spawnZombie()
      console.log('SPAWNING NEW ZOMBIE ', zombie)
//      playSound(zombie, 'sounds/pickUp.mp3', true)
    }
  }
}
engine.addSystem(gameLogicSystem)
}

//debug
utils.triggers.enableDebugDraw(false)

// LOAD LAST - LOW PRIORITY

export function ensureGameController() {
if (GameControllerComponent.has(gameEntity)) {
  return GameControllerComponent.getMutable(gameEntity)
} else {
  return GameControllerComponent.create(gameEntity)
}

}

//indicatorArrow
export const indicatorArrowTeal = engine.addEntity()
GltfContainer.create(indicatorArrowTeal, { src: 'models/indicatorArrow_teal.glb' })
Transform.create(indicatorArrowTeal, {
  position: Vector3.create(48, 3, 74),
  scale: Vector3.Zero()
})

//indicatorArrowL
export const indicatorArrowTeal2 = engine.addEntity()
GltfContainer.create(indicatorArrowTeal2, { src: 'models/indicatorArrow_teal.glb' })
Transform.create(indicatorArrowTeal2, {
  position: Vector3.create(17, 3, 67),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, -45, 0)
})

//indicatorArrowR
export const indicatorArrowTeal3 = engine.addEntity()
GltfContainer.create(indicatorArrowTeal3, { src: 'models/indicatorArrow_teal.glb' })
Transform.create(indicatorArrowTeal3, {
  position: Vector3.create(83, 3, 67),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, 45, 0)
})

//indicatorArrowDeepSwamp enter
export const indicatorArrowPurple1 = engine.addEntity()
GltfContainer.create(indicatorArrowPurple1, { src: 'models/indicatorArrow_purple.glb' })
Transform.create(indicatorArrowPurple1, {
  position: Vector3.create(93, 7, 17),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, 90, 0)
})

//indicatorArrowDeepSwamp exit
export const indicatorArrowPurple2 = engine.addEntity()
GltfContainer.create(indicatorArrowPurple2, { src: 'models/indicatorArrow_purple.glb' })
Transform.create(indicatorArrowPurple2, {
  position: Vector3.create(91, 4, 20),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, 10, -90)
})

//indicatorArrowDeepSwamp exit turn
export const indicatorArrowPurple3 = engine.addEntity()
GltfContainer.create(indicatorArrowPurple3, { src: 'models/indicatorArrow_purple.glb' })
Transform.create(indicatorArrowPurple3, {
  position: Vector3.create(49, 4, 26),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, 90, -90)
})

//indicatorArrowDeepSwamp exit finale
export const indicatorArrowGreen = engine.addEntity()
GltfContainer.create(indicatorArrowGreen, { src: 'models/indicatorArrow_green.glb' })
Transform.create(indicatorArrowGreen, {
  position: Vector3.create(91, 4, 32),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, 30, -90)
})

//prizeBoard exit finale
export const prizeBoard = engine.addEntity()
GltfContainer.create(prizeBoard, { src: 'models/prizeBoard.glb' })
Transform.create(prizeBoard, {
  position: Vector3.create(20, 16, -7),
  scale: Vector3.Zero(),
  rotation: Quaternion.fromEulerDegrees(0, -20, 30)
})


export const powerCubeEntity = createPowerCube(Vector3.create(96, 5.3, 33), 'models/powerRelic.glb')

    //relicOnly
   export const relicOnly = engine.addEntity()
    GltfContainer.create(relicOnly, { src: 'models/relicOnly.glb' })
    Transform.create(relicOnly, {
      position: Vector3.create(41, 0.3, 64),
      scale: Vector3.Zero()
    })

                //zombieCave2
                export const zombieCave2 = engine.addEntity()
                GltfContainer.create(zombieCave2, { src: 'models/cavePortalClosed.glb' })
                Transform.create(zombieCave2, {
                  position: Vector3.create(88.5, 1, 34),
                  scale: Vector3.create(0.4,0.4,0.4),
                  rotation: Quaternion.fromEulerDegrees(0, 205, 0)
                })
                
                //zombieCaveOpen exit
                export const zombieCaveOpen = engine.addEntity()
                GltfContainer.create(zombieCaveOpen, { src: 'models/cavePortal.glb' })
                Transform.create(zombieCaveOpen, {
                  position: Vector3.create(88.5, 1, 34),
                  scale: Vector3.Zero(),
                  rotation: Quaternion.fromEulerDegrees(0, 205, 0)
                })         

// Music - Song 1 - Ambience Eery
const song1 = engine.addEntity()

// Create AudioSource component
AudioSource.create(song1, {
	audioClipUrl: 'sounds/hauntedCave.mp3',
	loop: true,
	playing: true,
  volume: 1
})

// Music - Song 2 - Ambience Dripping
const song2 = engine.addEntity()
Transform.create(song2, {
  position: Vector3.create(80, 50, 80)
})

// Create AudioSource component
AudioSource.create(song2, {
	audioClipUrl: 'sounds/waterDrips.mp3',
	loop: true,
	playing: true,
  volume: 1
})

// Music - Song 3 - Beginning Soundtrack
export const song3 = engine.addEntity()
Transform.create(song3, {
  position: Vector3.create(80, 80, 80)
})


// Create AudioSource component
AudioSource.create(song3, {
	audioClipUrl: 'sounds/dreamSus.mp3',
	loop: true,
	playing: true,
  volume: 1
})

// Music - Song 4 - Zombie Fight Soundtrack
export const song4 = engine.addEntity()
Transform.create(song4, {
  position: Vector3.create(40, 10, 40)
})

// Create AudioSource component
AudioSource.create(song4, {
	audioClipUrl: 'sounds/dreamFight.mp3',
	loop: true,
	playing: false,
  volume: 1
})

// Music - Song 5 - Solving PowerCube Maze Soundtrack
export const song5 = engine.addEntity()
Transform.create(song5, {
  position: Vector3.create(40, 10, 44)
})

// Create AudioSource component
AudioSource.create(song5, {
	audioClipUrl: 'sounds/dreamWork.mp3',
	loop: true,
	playing: false,
  volume: 1
})

// SFX - Hammering - Zombie Fight Scene End
export const hammer = engine.addEntity()
Transform.create(hammer, {
  position: Vector3.create(30, 10, 25)
})

// Create AudioSource component
AudioSource.create(hammer, {
	audioClipUrl: 'sounds/hammer.mp3',
	loop: false,
	playing: false,
  volume: 1
})

// SFX - Splash - PowerCube End
export const splash = engine.addEntity()
Transform.create(splash, {
  position: Vector3.create(40, 5, 40)
})

// Create AudioSource component
AudioSource.create(splash, {
	audioClipUrl: 'sounds/splash.mp3',
	loop: false,
	playing: false,
  volume: 1
})

// SFX - Electricity - Maze End
export const electricity = engine.addEntity()
Transform.create(electricity, {
  position: Vector3.create(40, 15, 80)
})

// Create AudioSource component
AudioSource.create(electricity, {
	audioClipUrl: 'sounds/electricity.mp3',
	loop: false,
	playing: false,
  volume: 1
})

// SFX - Death - Kersplat Death
export const death = engine.addEntity()
Transform.create(death, {
  position: Vector3.create(90, 90, 100)
})

// Create AudioSource component
AudioSource.create(death, {
	audioClipUrl: 'sounds/death.wav',
	loop: false,
	playing: false,
  volume: 1
})

engine.addSystem(zombieKiller)
engine.addSystem(moveSystem)