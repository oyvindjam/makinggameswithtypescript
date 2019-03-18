import { Entity } from "./entity"
import { Vector2 } from "./Vector2"
import { SpriteRenderer } from "./SpriteRenderer"
import { removeEnemy, addEnemy } from "./main"
import {  worldHeight } from "./world"
import { drawWrappedAroundBottom } from "./enemy"
import { TextureAtlas } from "./TextureAtlas"
import { FlyingPart } from "./FlyingPart"
import { AnimationPlayer, switchAnimation } from "./AnimationPlayer";
import { AnimationMode, Animation } from "./Animation";
import { Frame } from "./Frame";
import { tVector2, tRectangle } from "./temporaryObjects";
import { Level } from "./Level";
import { resolveCollision } from "./collission";

export class Blueberry implements Entity {

  health = 1
  position = new Vector2
  private velocity = new Vector2
  direction = -1

  private run = animations.run
  private fall = animations.fall

  private animationPlayer = new AnimationPlayer(this.run)

  constructor(
    private spriteRenderer: SpriteRenderer,
    private level: Level
  ) { }

  getHitBy(position: Vector2, damage: number) {
    position
    this.health -= damage
    if (this.health > 0) return

    removeEnemy(this)
    const mirrored = this.direction > 0

    const parts = [
      new FlyingPart(this.spriteRenderer, TextureAtlas.blueberryPart0, mirrored),
      new FlyingPart(this.spriteRenderer, TextureAtlas.blueberryPart1, mirrored)
    ]

    for (const part of parts) {
      part.position.x = this.position.x
      part.position.y = this.position.y
      addEnemy(part)
    }
  }

  getBoundingRectangle() {
    const frame = this.animationPlayer.currentSprite()
    return tRectangle.get(this.position.x + 5, this.position.y + 5, frame.width - 8, frame.height - 9)
  }

  update(delta: number) {
    this.animationPlayer.update(delta)

    const oldPosition = tVector2.get(this.position.x, this.position.y)
    this.velocity.y += 550 * delta
    this.position.y += this.velocity.y * delta
    this.position.x += this.velocity.x * delta

    const width = this.animationPlayer.currentSprite().width
    const height = this.animationPlayer.currentSprite().height

    for (let line of this.level.collisionLines) {
      const newPosition = resolveCollision(oldPosition, this.position, width, height, line)
      if (newPosition) {
        if (newPosition.y < this.position.y) {
          this.velocity.y = 0
        }
        if (newPosition.x < this.position.x) {
          this.velocity.x = 0
          this.direction = -1
        } else if (newPosition.x > this.position.x) {
          this.velocity.x = 0
          this.direction = 1
        }
        this.position.set(newPosition.x, newPosition.y)
      }
    }
    
    if (this.velocity.y == 0) {
      this.velocity.x += 2 * this.direction
    }
    if (this.position.y > worldHeight) {
      this.position.y = 0
    }

    if (this.velocity.y == 0) switchAnimation(this.run, this.animationPlayer)
    if (this.velocity.y > 0) switchAnimation(this.fall, this.animationPlayer)

  }

  draw() {
    const sprite = this.animationPlayer.currentSprite()
    drawWrappedAroundBottom(this.position.x, this.position.y, sprite, this.spriteRenderer, this.direction > 0)
  }
}


const animations = {
  run: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.blueberryRun0),
      new Frame(0.1, TextureAtlas.blueberryRun1),
      new Frame(0.1, TextureAtlas.blueberryRun2),
      new Frame(0.1, TextureAtlas.blueberryRun3),
      new Frame(0.1, TextureAtlas.blueberryRun4),
      new Frame(0.1, TextureAtlas.blueberryRun5),
    ]),
  fall: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.blueberryRun0),
      new Frame(0.1, TextureAtlas.blueberryRun1)
    ]),
}
