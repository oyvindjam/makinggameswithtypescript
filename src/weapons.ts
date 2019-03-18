import { Vector2 } from "./Vector2"

export interface Weapon {
  update(delta: number): void
  use(): void
  draw(): void

  direction: number
  position: Vector2
}