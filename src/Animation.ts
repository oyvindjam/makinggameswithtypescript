import { Frame } from "./Frame"

export enum AnimationMode {
  loop, once
}

export class Animation {
  constructor(
    public mode: AnimationMode,
    public frames: Frame[]
  ) { }
}