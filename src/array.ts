export function shuffled<T>(array: ReadonlyArray<T>): T[] {
  const shuffeled = array.slice()
  shuffle(shuffeled)
  return shuffeled
}

export function shuffle<T>(array: T[]): void {
  for (let i = 0; i < array.length - 1; i++) {
    const tmp = array[i]
    const index = (i + 1) + Math.floor(Math.random() * (array.length - i - 1))
    array[i] = array[index]
    array[index] = tmp
  }
}