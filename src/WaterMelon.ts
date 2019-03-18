import { Entity } from "./entity"
import { Vector2 } from "./Vector2"
import { SpriteRenderer } from "./SpriteRenderer"
import { removeEnemy, addEnemy } from "./main"
import { worldHeight } from "./world"
import { drawWrappedAroundBottom } from "./enemy"
import { FlyingPart } from "./FlyingPart"
import { TextureAtlas } from "./TextureAtlas"
import { AnimationPlayer } from "./AnimationPlayer";
import { Animation, AnimationMode } from "./Animation";
import { Frame } from "./Frame";
import { tRectangle, tVector2 } from "./temporaryObjects";
import { Level } from "./Level";
import { resolveCollision } from "./collission";

export class WaterMelon implements Entity {
  private health = 5
  private animationPlayer = new AnimationPlayer(animations.run)
  private velocity = new Vector2
  position = new Vector2
  direction = -1

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
      new FlyingPart(this.spriteRenderer, TextureAtlas.melonPart0, mirrored),
      new FlyingPart(this.spriteRenderer, TextureAtlas.melonPart1, mirrored),
      new FlyingPart(this.spriteRenderer, TextureAtlas.melonPart2, mirrored)
    ]

    for (const part of parts) {
      part.position.set(this.position.x, this.position.y)
      addEnemy(part)
    }
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
      this.velocity.x += 1 * this.direction
    }
    if (this.position.y > worldHeight) {
      this.position.y = 0
    }
    //if (this.velocity.y == 0) switchAndResetIfNewAnimation(Animations.blueBerry.run, this.animationPlayer)
    //if (this.velocity.y > 0) switchAndResetIfNewAnimation(Animations.blueBerry.fall, this.animationPlayer)
  }


  getBoundingRectangle() {
    const frame = this.animationPlayer.currentSprite()
    return tRectangle.get(this.position.x + 10, this.position.y + 7, frame.width - 14, frame.height - 11)
  }

  draw() {
    const sprite = this.animationPlayer.currentSprite()
    drawWrappedAroundBottom(this.position.x, this.position.y, sprite, this.spriteRenderer, this.direction > 0)
  }
}

const animations = {
  run: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.melonRun0),
      new Frame(0.1, TextureAtlas.melonRun1),
      new Frame(0.1, TextureAtlas.melonRun2),
      new Frame(0.1, TextureAtlas.melonRun3),
      new Frame(0.1, TextureAtlas.melonRun4),
      new Frame(0.1, TextureAtlas.melonRun5),
    ]),
  fall: new Animation(AnimationMode.loop,
    [

    ]),
}