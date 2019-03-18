import { GraphicsBackend } from "./GraphicsBackend"
import { Rectangle } from "./Rectangle"

export class GraphicsContext2D implements GraphicsBackend {

  private context: CanvasRenderingContext2D
  constructor(
    canvas: HTMLCanvasElement
  ) {
    const context = canvas.getContext("2d", {alpha: false})
    if (context == null) throw new Error("Could not get 2d context")
    this.context = context
    this.context.imageSmoothingEnabled = false
  }

  draw(dest: Rectangle, src: Rectangle, image: HTMLImageElement,
    mirrored: boolean
  ) {
    let destX = dest.x
    let destWidth = dest.width

    if (mirrored) {
      this.context.scale(-1, 1)
      destX *= -1
      destWidth *= -1
    }
    this.context.drawImage(image,
      src.x, src.y, src.width, src.height,
      destX, dest.y, destWidth, dest.height)

    if (mirrored) this.context.scale(-1, 1)
  }

  clear(red: number, green: number, blue: number) {
    this.context.fillStyle = `rgb(${red}, ${green}, ${blue})`
    this.context.fillRect(0, 0, this.context.canvas.width,
      this.context.canvas.height)
  }
  
  present(): void {}
}