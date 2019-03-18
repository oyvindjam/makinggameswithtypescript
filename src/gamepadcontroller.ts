import { Controller } from "./Controller"

export class GamepadController {

  private buttonIndexLeft = 14
  private buttonIndexRight = 15
  private buttonIndexJump = 0
  private buttonIndexShoot = 2

  private horizontalAxisIndex = 0
  private lastHorizontalAxisValue = 0
  private axisTreshold = 0.5

  private leftIsPressed = false
  private rightIsPressed = false
  private jumpIsPressed = false
  private shootIsPressed = false

  constructor(
    private controller: Controller
  ) {
    this.update()
  }

  private update() {
    requestAnimationFrame(() => this.update())
    const gamepad = getFirstGamepad()
    if (!gamepad) return

    this.updateButtons(gamepad)
    this.updateAxis(gamepad)    
  }

  updateButtons(gamepad: Gamepad) {
    const leftPressedNow = isButtonPressed(this.buttonIndexLeft, gamepad)
    if (this.leftIsPressed !== leftPressedNow) {
      if (leftPressedNow) this.controller.pressLeft()
      else this.controller.releaseLeft()
    }

    const rightPressedNow = isButtonPressed(this.buttonIndexRight, gamepad)
    if (this.rightIsPressed !== rightPressedNow) {
      if (rightPressedNow) this.controller.pressRight()
      else this.controller.releaseRight()
    }

    const shootPressedNow = isButtonPressed(this.buttonIndexShoot, gamepad)
    if (this.shootIsPressed !== shootPressedNow) {
      if (shootPressedNow) this.controller.pressActionButton2()
      else this.controller.releaseActionButton2()
    }

    const jumpPressedNow = isButtonPressed(this.buttonIndexJump, gamepad)
    if (this.jumpIsPressed !== jumpPressedNow) {
      if (jumpPressedNow) this.controller.pressActionButton1()
      else this.controller.releaseActionButton1()
    }

    this.leftIsPressed = leftPressedNow
    this.rightIsPressed = rightPressedNow
    this.jumpIsPressed = jumpPressedNow
    this.shootIsPressed = shootPressedNow
  }

  updateAxis(gamepad: Gamepad) {
    const horizontalAxis = gamepad.axes[this.horizontalAxisIndex] || 0
    if (horizontalAxis < -this.axisTreshold) {
      if (this.lastHorizontalAxisValue == 1) this.controller.releaseRight()
      if (this.lastHorizontalAxisValue != -1) {
        this.lastHorizontalAxisValue = -1
        this.controller.pressLeft()
      }
    } else if (horizontalAxis > this.axisTreshold) {
      if (this.lastHorizontalAxisValue == -1) this.controller.releaseLeft()
      if (this.lastHorizontalAxisValue != 1) {
        this.lastHorizontalAxisValue = 1
        this.controller.pressRight()
      }
    } else {
      if(this.lastHorizontalAxisValue == -1) this.controller.releaseLeft()
      if(this.lastHorizontalAxisValue == 1) this.controller.releaseRight()
      this.lastHorizontalAxisValue = 0
    }
  }
}

function getFirstGamepad() {
  for (const gamepad of navigator.getGamepads()) if (gamepad) return gamepad
  return null
}

function isButtonPressed(index: number, gamepad: Gamepad) {
  if (index >= gamepad.buttons.length) return false
  return gamepad.buttons[index].pressed
}