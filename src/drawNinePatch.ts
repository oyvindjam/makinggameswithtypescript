import { NinePatch } from "./NinePatch";
import { SpriteRenderer } from "./SpriteRenderer";
import { Rectangle } from "./Rectangle";
import { tRectangle } from "./temporaryObjects";

export function drawNinePatch(area: Rectangle, ninePatch: NinePatch, renderer: SpriteRenderer) {
  const horizontalWidth = area.width - ninePatch.topLeft.width - ninePatch.topRight.width
  const verticalHeight = area.height - ninePatch.topLeft.height - ninePatch.bottomLeft.height

  let x = area.x
  let y = area.y

  const topLeft = tRectangle.get(x, y, ninePatch.topLeft.width, ninePatch.topLeft.height)
  x += topLeft.width
  const topCenter = tRectangle.get(x, y, horizontalWidth, topLeft.height)
  x += topCenter.width
  const topRight = tRectangle.get(x, y, ninePatch.topRight.width, ninePatch.topRight.height)
  x = area.x
  y += topLeft.height

  const middleLeft = tRectangle.get(x, y, ninePatch.middleLeft.width, verticalHeight)
  x += middleLeft.width
  const middleCenter = tRectangle.get(x, y, horizontalWidth, verticalHeight)
  x += middleCenter.width
  const middleRigth = tRectangle.get(x, y, ninePatch.middleRight.width, verticalHeight)
  x = area.x
  y += middleLeft.height

  const bottomLeft = tRectangle.get(x, y, ninePatch.bottomLeft.width, ninePatch.bottomLeft.width)
  x += bottomLeft.width
  const bottomCenter = tRectangle.get(x, y, horizontalWidth, ninePatch.bottomCenter.height)
  x += bottomCenter.width
  const bottomRight = tRectangle.get(x, y, ninePatch.bottomRight.width, ninePatch.bottomRight.height)

  renderer.sprite2(topLeft, ninePatch.topLeft)
  renderer.sprite2(topCenter, ninePatch.topCenter)
  renderer.sprite2(topRight, ninePatch.topRight)
  renderer.sprite2(middleLeft, ninePatch.middleLeft)
  renderer.sprite2(middleCenter, ninePatch.middleCenter)
  renderer.sprite2(middleRigth, ninePatch.middleRight)
  renderer.sprite2(bottomLeft, ninePatch.bottomLeft)
  renderer.sprite2(bottomCenter, ninePatch.bottomCenter)
  renderer.sprite2(bottomRight, ninePatch.bottomRight)
}