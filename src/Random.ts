export interface SequenceGenerator {
  next(): number
}

export class Random {
  constructor(
    private randomNumberGenerator: SequenceGenerator
  ) { }

  shuffle<T>(array: T[]): void {
    for (let i = 0; i < array.length - 1; i++) {
      const tmp = array[i]
      const index = (i + 1) + Math.floor(this.randomNumberGenerator.next() * (array.length - i - 1))
      array[i] = array[index]
      array[index] = tmp
    }
  }
}