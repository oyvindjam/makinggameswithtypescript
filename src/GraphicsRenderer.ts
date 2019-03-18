import { GraphicsBackend } from "./GraphicsBackend"
import { Rectangle } from "./Rectangle";
import { Renderer } from "./Renderer";
import { tRectangle } from "./temporaryObjects";

export class GraphicsRenderer implements Renderer {

  constructor(
    private graphics: GraphicsBackend
  ) { }

  image(dest: Rectangle, src: Rectangle,
    image: HTMLImageElement, mirrored: boolean
  ) {
    dest = tRectangle.get(Math.round(dest.x), Math.round(dest.y),
      Math.round(dest.width), Math.round(dest.height))
    this.graphics.draw(dest, src, image, mirrored)
  }
}