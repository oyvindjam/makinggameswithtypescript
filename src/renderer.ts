import { Rectangle } from "./Rectangle";

export interface Renderer {
  image(dest: Rectangle, texture: Rectangle,
    image: HTMLImageElement, mirrored: boolean): void
}