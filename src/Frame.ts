import { Rectangle } from "./Rectangle";

export class Frame {
  constructor(
    readonly seconds: number,
    readonly sprite: Rectangle
  ) { }
}