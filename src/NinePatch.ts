import { Rectangle } from "./Rectangle"

export class NinePatch {
  constructor(
    public topLeft: Rectangle,
    public topCenter: Rectangle,
    public topRight: Rectangle,
    public middleLeft: Rectangle,
    public middleCenter: Rectangle,
    public middleRight: Rectangle,
    public bottomLeft: Rectangle,
    public bottomCenter: Rectangle,
    public bottomRight: Rectangle,
  ) { }
}