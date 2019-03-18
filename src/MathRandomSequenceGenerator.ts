import { SequenceGenerator } from "./Random"

export class MathRandomSequenceGenerator implements SequenceGenerator {
  next(): number {
    return Math.random()
  }
}