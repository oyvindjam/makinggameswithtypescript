import { Controller } from "./Controller"

export class KeyController {
  constructor(
    controller: Controller,
    leftKeys: ReadonlyArray<string>,
    rightKeys: ReadonlyArray<string>,
    actionButton1Keys: ReadonlyArray<string>,
    actionButton2Keys: ReadonlyArray<string>,
  ) {
    window.addEventListener("keydown", keyboardEvent => {
      if (keyboardEvent.repeat) return
      else if (leftKeys.includes(keyboardEvent.code)) controller.pressLeft()
      else if (rightKeys.includes(keyboardEvent.code)) controller.pressRight()
      else if (actionButton1Keys.includes(keyboardEvent.code)) controller.pressActionButton1()
      else if (actionButton2Keys.includes(keyboardEvent.code)) controller.pressActionButton2()
    })

    window.addEventListener("keyup", keyboardEvent => {
      if (leftKeys.includes(keyboardEvent.code)) controller.releaseLeft()
      else if (rightKeys.includes(keyboardEvent.code)) controller.releaseRight()
      else if (actionButton1Keys.includes(keyboardEvent.code)) controller.releaseActionButton1()
      else if (actionButton2Keys.includes(keyboardEvent.code)) controller.releaseActionButton2()
    })
  }
}