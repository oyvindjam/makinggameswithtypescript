import { Rectangle } from "./Rectangle"
import { SpriteRenderer } from "./SpriteRenderer"
import { worldHeight } from "./world"

export function drawWrappedAroundBottom(x: number, y: number, sprite: Rectangle, renderer: SpriteRenderer, mirrored: boolean = false) {
  renderer.sprite(x, y, sprite, mirrored)
  if (y + sprite.height > worldHeight) {
    const overflow = y + sprite.height - worldHeight
    renderer.sprite(x, -sprite.height + overflow, sprite, mirrored)
  }
}
