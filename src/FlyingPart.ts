import { Entity } from "./entity"
import { Vector2 } from "./Vector2"
import { SpriteRenderer } from "./SpriteRenderer"
import { Rectangle } from "./Rectangle"
import { removeEnemy } from "./main"
import { degreesToRadians } from "./math"

export class FlyingPart implements Entity {

  position = new Vector2
  velocity = new Vector2
  time = 0

  constructor(
    private spriteRenderer: SpriteRenderer,
    private sprite: Rectangle,
    private mirrored: boolean
  ) {
    const direction = degreesToRadians(Math.random() * 180)
    const speed = 60 + Math.random() * 90
    this.velocity.x = Math.cos(direction) * speed
    this.velocity.y = Math.sin(direction) * speed
  }

  getHitBy() { }
  getBoundingRectangle() { return null }

  draw(): void {
    this.spriteRenderer.sprite(this.position.x, this.position.y, this.sprite, this.mirrored)
  }

  update(delta: number) {

    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta

    this.velocity.y += 150 * delta

    this.time += delta
    if (this.time >= 3) {
      removeEnemy(this)
    }
  }
}