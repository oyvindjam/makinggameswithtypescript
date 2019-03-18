import { Controller } from "./Controller"
import { worldWidth, worldHeight, tileSize } from "./world"
import { TextureAtlas } from "./TextureAtlas"
import { Rectangle } from "./Rectangle"
import { SpriteRenderer } from "./SpriteRenderer"
import { ScaleRenderer } from "./ScaleRenderer";
import { TranslationRenderer } from "./TranslationRenderer";

enum Button {
  left, rigth, jump, shoot
}

class PointerState {
  constructor(
    readonly pointerId: number,
    public button: Button
  ) { }
}

export class PointerController {

  readonly buttons: ReadonlyArray<Rectangle> = [
    TextureAtlas.buttonJump, TextureAtlas.buttonShoot,
    TextureAtlas.buttonLeft, TextureAtlas.buttonRight
  ]
  private pointerStates: PointerState[] = []
  private readonly buttonWidth = worldWidth / this.buttons.length

  constructor(
    private controller: Controller,
    canvas: HTMLCanvasElement,
    private scaleRenderer: ScaleRenderer,
    private translationRenderer: TranslationRenderer
  ) {
    canvas.addEventListener("pointerdown", pointerEvent => {
      const x = this.toWorldCoordinate(pointerEvent.x)
      const button = this.getButton(x)
      if (button == null) return

      this.press(button)
      this.pointerStates = this.pointerStates.filter(
        pointerState => pointerState.pointerId != pointerEvent.pointerId)

      const pointerState = new PointerState(pointerEvent.pointerId, button)
      this.pointerStates.push(pointerState)
    })

    canvas.addEventListener("pointerup", pointerEvent => {
      const pointerState = this.pointerStates.find(
        pointerState => pointerState.pointerId == pointerEvent.pointerId)
      if (!pointerState) return

      this.release(pointerState.button)

      const index = this.pointerStates.indexOf(pointerState)
      if (index == -1) return
      this.pointerStates.splice(index, 1)
    })

    canvas.addEventListener("pointermove", pointerEvent => {
      const pointerState = this.pointerStates.find(
        pointerState => pointerState.pointerId == pointerEvent.pointerId)
      if (!pointerState) return

      const x = this.toWorldCoordinate(pointerEvent.x)
      const button = this.getButton(x)
      if (button == null) return

      pointerState.button != button

      this.release(pointerState.button)
      this.press(button)
      pointerState.button = button
    })
  }

  private release(button: Button) {
    if (button == Button.jump) this.controller.releaseActionButton1()
    else if (button == Button.shoot) this.controller.releaseActionButton2()
    else if (button == Button.left) this.controller.releaseLeft()
    else if (button == Button.rigth) this.controller.releaseRight()
  }

  private press(button: Button) {
    if (button == Button.jump) this.controller.pressActionButton1()
    else if (button == Button.shoot) this.controller.pressActionButton2()
    else if (button == Button.left) this.controller.pressLeft()
    else if (button == Button.rigth) this.controller.pressRight()
  }

  private toWorldCoordinate(x: number) {
    x -= this.translationRenderer.xOffset
    x /= this.scaleRenderer.scale
    return x
  }

  private isJumpButton(x: number) {
    return x < this.buttonWidth
  }
  private isShootButton(x: number) {
    return x >= this.buttonWidth && x < 2 * this.buttonWidth
  }
  private isLeftButton(x: number) {
    return x >= 2 * this.buttonWidth && x < 3 * this.buttonWidth
  }
  private isRightButton(x: number) {
    return x >= 2 * this.buttonWidth
  }

  private getButton(x: number) {
    if (this.isJumpButton(x)) return Button.jump
    if (this.isShootButton(x)) return Button.shoot
    if (this.isLeftButton(x)) return Button.left
    if (this.isRightButton(x)) return Button.rigth
    return null
  }

  draw(spriteRenderer: SpriteRenderer) {
    const buttonWidth = worldWidth / this.buttons.length
    for (let i = 0; i < this.buttons.length; i++) {
      const sprite = this.buttons[i]
      const x = i * buttonWidth + buttonWidth / 2 - sprite.width / 2
      spriteRenderer.sprite(x, worldHeight - sprite.height - tileSize / 4, sprite)
    }
  }
}