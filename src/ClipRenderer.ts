import { Rectangle } from "./Rectangle";
import { tRectangle, tVector2 } from "./temporaryObjects";
import { Renderer } from "./Renderer";

export class ClipRenderer implements Renderer {
  isClipping = false
  rectangle = new Rectangle(0, 0, 0, 0)

  constructor(
    private renderer: Renderer
  ) { }

  image(dest: Rectangle, texture: Rectangle,
    image: HTMLImageElement, mirrored: boolean
  ) {
    if (this.isClipping) {
      dest = tRectangle.get(dest.x, dest.y, dest.width, dest.height)
      const overlap = findOverlap(dest, this.rectangle)
      if (!overlap) return


      let sx = (overlap.x - dest.x) / dest.width
      if (mirrored) {
        sx = ((dest.x + dest.width) - (overlap.x + overlap.width)) / (dest.width)
      }
      const sy = (overlap.y - dest.y) / dest.height
      const sw = (dest.width - overlap.width) / dest.width
      const sh = (dest.height - overlap.height) / dest.height
      texture = tRectangle.get(
        texture.x + sx * texture.width,
        texture.y + sy * texture.height,
        texture.width - sw * texture.width,
        texture.height - sh * texture.height
      )

      dest = overlap
    }
    this.renderer.image(dest, texture, image, mirrored)
  }

  clip(rectangle: Rectangle | null) {
    this.isClipping = rectangle != null
    if (rectangle != null) {
      this.rectangle.set(rectangle.x, rectangle.y,
        rectangle.width, rectangle.height)
    }
  }
}

export function findOverlap(a: Rectangle, b: Rectangle) {
  const ap0 = tVector2.get(a.x, a.y)
  const ap1 = tVector2.get(a.x + a.width, a.y + a.height)

  const bp0 = tVector2.get(b.x, b.y)
  const bp1 = tVector2.get(b.x + b.width, b.y + b.height)

  const o0x = Math.max(ap0.x, bp0.x)
  const o0y = Math.max(ap0.y, bp0.y)

  const o1x = Math.min(ap1.x, bp1.x)
  const o1y = Math.min(ap1.y, bp1.y)

  if (o0x >= o1x || o0y >= o1y) return null

  return tRectangle.get(o0x, o0y, o1x - o0x, o1y - o0y)
}