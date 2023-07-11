import { Dialog } from 'dcl-npc-toolkit'
import { zombieKiller } from './systems/zombieKiller'
import { Transform, engine, AudioSource } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import {zombieCave2, zombieCaveOpen, treeWall9, doorClosed, powerCubeEntity, clickableEntity, song3, song4, song5, triggerGameStart, indicatorArrowPurple1, indicatorArrowGreen } from '.'

export let testscript: Dialog[] = [
  {
    text: `Me swamp's been overtaken by evil creatures!`,
    triggeredByNext: () => {
      console.log('song3 ended')
      AudioSource.getMutable(song3).playing = false;
      AudioSource.getMutable(song4).playing = true;
          }
        
  },
  {
    text: `Don't just stand there, help me clear out the undead!`,
    isQuestion: true,
    buttons: [
       { label: ` No way!`, goToDialog: 3, triggeredActions:()=>{
         console.log('no leave me alone')
       } },
       { label: `  OK I'll help`, goToDialog: 2, triggeredActions:()=>{
        console.log('yes i want to help')
        zombieKiller()
        triggerGameStart()
      } },
    ]
  },
  {
    text: `Here are some rocks to hit them with! Be sure to get them all!`,
    isEndOfDialog: true
  },
  {
    text: `Take a rest, then give me a hand after.`,
    isEndOfDialog: true
  }
]

export let fightComplete: Dialog[] = [
  {
    text: `Great job! Clear out the rest, then come back and talk to me`,
    portrait: {
      path: 'images/doge.png'
    },
    isEndOfDialog: true
  }
]

export let uncle2: Dialog[] = [
  {
    text: `Now that evil is gone, please help find my family heirloom! I believe it was taken deep into the swamp.`,
    triggeredByNext: () => {
      console.log('song4 ended')
      AudioSource.getMutable(song4).playing = false;
      AudioSource.getMutable(song5).playing = true;
      Transform.getMutable(powerCubeEntity).scale = Vector3.One();
      Transform.getMutable(powerCubeEntity).position = Vector3.create(96, 1.3, 33);
      Transform.getMutable(indicatorArrowPurple1).scale = Vector3.create(6,6,6);
          }
  },
  {
    text: `If dirty maybe wash it in the Fountain of Power?`,
    isQuestion: true,
    buttons: [
       { label: ` Idk...`, goToDialog: 3, triggeredActions:()=>{
         console.log('no leave me alone')
       } },
       { label: `  OK omw!`, goToDialog: 2, triggeredActions:()=>{
        console.log('yes i want to help')

      } },
    ]
  },
  {
    text: `Press E to pick up the relic - I mean heirloom and F to dunk it in the Fountain of Power`,
    isEndOfDialog: true
  },
  {
    text: `Just go for nice walk deep in the swamp and ponder it over. Press E to pick up and F to drop`,
    isEndOfDialog: true
  }
]

export let beckoning: Dialog[] = [
  {
    text: `The relic reacts to the Fountain of Power and the energy barricade behind it dissipates.`,
     portrait: {
       path: 'images/marsha.png'
     }
  },

  {
    text: `Waves of energy course through you as you're compelled to investivate its mystical source.`,
    portrait: {
      path: 'images/marsha.png'
    }
  },
  {
    text: `Choose one of 3 entry gates and find your way to the top of the rubble.`,
    portrait: {
      path: 'images/marsha.png'
    },
    isQuestion: true,
    buttons: [
       { label: ` Repeat that`, goToDialog: 0, triggeredActions:()=>{
         console.log('repeat that')
       } },
       { label: `  Got it!`, goToDialog: 3, triggeredActions:()=>{
        console.log('got it')
      } },
    ]
  },
  {
    text: `Great knowledge and creativity awaits you.`,
    portrait: {
      path: 'images/marsha.png'
    },
    isEndOfDialog: true
  }
]

export let questioning: Dialog[] = [
  {
    text: `You should see if Uncle knows how to use this.`,
    portrait: {
      path: 'images/marsha.png'
    },
    isEndOfDialog: true
  }
]

export let callingHelp: Dialog[] = [
  {
    text: `Help! Help! Can anybody hear me? I'm stuck! Help!`,
    portrait: {
      path: 'images/doge.png'
    },
    isEndOfDialog: true,
    triggeredByNext: () => {
console.log('helpSound playing')
      AudioSource.getMutable(doorShut).playing = true;
    }
  }
]

export let beatGame: Dialog[] = [
  {
    text: `Come back each week for another chance to earn a wearable!`,
    portrait: {
      path: 'images/marsha.png'
    },
    isEndOfDialog: true
  }
]

// Create entity
export const doorShut = engine.addEntity()
Transform.create(doorShut, {
  position: Vector3.create(40, 50, 60)
})

// Create AudioSource component
AudioSource.create(doorShut, {
	audioClipUrl: 'sounds/doorShut.mp3',
	loop: false,
	playing: false,
  volume: 1
})

export let uncleFinale: Dialog[] = [
  {
    text: `IT'S FINALLY MINE! NOW MY EXPERIMENT CAN BE COMPLETED!`,
    portrait: {
      path: 'images/doge.png'
    }
  },
  {
    text: `Uncle is acting strangely. Maybe come back and check on him later.`,
    portrait: {
      path: 'images/marsha.png'
    },
    triggeredByNext: () => {
      Transform.getMutable(doorClosed).scale = Vector3.create(-1 , 1, 1);
      AudioSource.getMutable(song5).playing = false;
      AudioSource.getMutable(doorShut).playing = true;
      Transform.getMutable(clickableEntity).scale = Vector3.create(3, 3, 3);
      Transform.getMutable(zombieCave2).scale = Vector3.Zero();
      Transform.getMutable(zombieCaveOpen).scale = Vector3.create(0.4, 0.4, 0.4);
      Transform.getMutable(indicatorArrowGreen).scale = Vector3.create(6,6,6);

    },
  },
  {
    text: `You may now exit through the Passage of Light at the far end of the swamp.`,
    portrait: {
      path: 'images/marsha.png'
    },
    isEndOfDialog: true
  }
]

export let dogeDialog = [
  {
    text: `Wowe! Thanks for helping me earlier with a push on me bumbum. Uncle must be worried sick!`
  },
  {
    text: `Will you go check on him and tell him I'm okay?`,
    isQuestion: true,
    triggeredByNext: () => {
      engine.removeEntity(treeWall9)
    },
    buttons: [
      { label: `  No way`, goToDialog: 3, triggeredActions:()=>{
        engine.removeEntity(treeWall9)
      } },
      { label: `OK omw!`, goToDialog: 2, triggeredActions:()=>{
        engine.removeEntity(treeWall9)
      } }
    ]
  },
  {
    text: `Watch your step on the way down! hehe`,
    isEndOfDialog: true
  },
  {
    text: `He would do it for you...`,
    isEndOfDialog: true
  }
]
