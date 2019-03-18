import { Renderer } from "./Renderer";
import { Rectangle } from "./Rectangle";
import { tRectangle } from "./temporaryObjects";

export class TranslationRenderer implements Renderer {
  xOffset = 0
  yOffset = 0

  constructor(
    private renderer: Renderer
  ) { }

  image(dest: Rectangle, texture: Rectangle,
    image: HTMLImageElement, mirrored: boolean
  ) {
    dest = tRectangle.get(
      dest.x + this.xOffset,
      dest.y + this.yOffset,
      dest.width, dest.height
    )
    this.renderer.image(dest, texture, image, mirrored)
  }
}