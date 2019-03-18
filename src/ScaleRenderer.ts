import { Rectangle } from "./Rectangle";
import { tRectangle } from "./temporaryObjects";
import { Renderer } from "./Renderer";
import { TranslationRenderer } from "./TranslationRenderer";

export class ScaleRenderer implements Renderer {
  scale = 1

  constructor(
    private renderer: TranslationRenderer
  ) { }

  image(dest: Rectangle, texture: Rectangle,
    image: HTMLImageElement, mirrored: boolean
  ) {
    dest = tRectangle.get(
      dest.x * this.scale,
      dest.y * this.scale,
      dest.width * this.scale,
      dest.height * this.scale
    )
    this.renderer.image(dest, texture, image, mirrored)
  }
}

