import { Rectangle } from "./Rectangle"
import { Vector2 } from "./Vector2"

export interface Updatable {
  update(delta: number): void
}

export interface Drawable {
  draw(): void
}

export interface Collidable {
  getCollision(): Rectangle | null
}


export interface Entity {
  getHitBy(position: Vector2, damage: number): void // TODO this should not be in this interface
  getBoundingRectangle(): Rectangle | null // TODO this should not be in this interface
  update(delta: number): void
  draw(): void
}