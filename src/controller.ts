export interface Controller {
  pressLeft(): void
  releaseLeft(): void

  pressRight(): void
  releaseRight(): void

  pressActionButton1(): void
  releaseActionButton1(): void

  pressActionButton2(): void
  releaseActionButton2(): void
}