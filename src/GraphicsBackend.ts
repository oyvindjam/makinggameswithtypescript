import { Rectangle } from "./Rectangle";

export interface GraphicsBackend {
  clear(red: number, green: number, blue: number): void
  draw(dest: Rectangle, src: Rectangle, image: HTMLImageElement, mirrored: boolean): void
  present(): void
}