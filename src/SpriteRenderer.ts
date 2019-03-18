import { Rectangle } from "./Rectangle"
import { tRectangle } from "./temporaryObjects";
import { Renderer } from "./Renderer";

export class SpriteRenderer {
  constructor(
    private renderer: Renderer,
    private texture: HTMLImageElement
  ) { }

  // TODO maybe to flip the sprite I can flip the rectangle instaed of the mirrored boolean
  sprite(x: number, y: number, sprite: Rectangle, mirrored: boolean = false) {
    const dest = tRectangle.get(x, y, sprite.width, sprite.height)
    this.renderer.image(dest, sprite, this.texture, mirrored)
  }

  // TODO probably just use this instead of the regular sprite since 
  sprite2(area: Rectangle, sprite: Rectangle) {
    this.renderer.image(area, sprite, this.texture, false)
  }

}