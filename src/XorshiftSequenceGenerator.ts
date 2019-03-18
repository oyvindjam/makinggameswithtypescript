import { SequenceGenerator } from "./Random"

// TODO We have an issue since javascript numbers uses float and they are not unsigned which means we get problems here
export class XorshiftSequenceGenerator implements SequenceGenerator {
  state: number

  constructor(seed: number) {
    this.state = seed
  }

  next(): number {
    this.state ^= this.state << 13
    this.state ^= this.state >> 7
    this.state ^= this.state << 17
    return this.state
  }
}