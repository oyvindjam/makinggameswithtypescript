import { Rectangle } from "./Rectangle";

export class ImageCommand {
  constructor(
    public dest: Rectangle,
    public z: number,
    public src: Rectangle,
    public image: HTMLImageElement,
    public mirrored: boolean
  ) { }
}