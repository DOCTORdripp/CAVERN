import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { NpcUtilsUi } from 'dcl-npc-toolkit'

const SceneOwnedUi = () => [
  // other UI elements
  NpcUtilsUi(),
  kersplatIcon(),
  // other UI elements
]

// Variable to reflect current state of menu visibility
var isMenuVisible: boolean = false

export const kersplatIcon = () => (
	 // parent
   <UiEntity
   uiTransform={{
    width:1024,
    height: 586,
    alignContent: 'center',
    justifyContent: 'center',
    display: isMenuVisible ? 'flex': 'none',
    margin: { top: '5%', left: '15%' }
   }}
   uiBackground={{ texture: {src: "images/kersplat.png"} }}
   onMouseDown = {toggleMenuVisibility}
   uiText={{ value: `click to close`, fontSize: 18, textAlign: 'bottom-center' }}
 />

 
)

// Function to toggle the state of the menu
export function toggleMenuVisibility(){
  isMenuVisible = !isMenuVisible;
}

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(SceneOwnedUi)
}
