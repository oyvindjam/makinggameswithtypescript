import { Weapon } from "./weapons"
import { Vector2 } from "./Vector2"
import { SpriteRenderer } from "./SpriteRenderer"
import { Entity } from "./entity"
import { tileSize } from "./world"
import { doRectanglesOverlap } from "./collission"
import { TextureAtlas } from "./TextureAtlas"
import { AnimationPlayer } from "./AnimationPlayer";
import { Animation, AnimationMode } from "./Animation";
import { Frame } from "./Frame";
import { tRectangle } from "./temporaryObjects";

export class Knife implements Weapon {

  position = new Vector2
  reloadTime = 0
  direction = -1
  timeSinceLastUse = 10
  animationPlayer = new AnimationPlayer(animations.useKnife)

  constructor(
    private spriteRenderer: SpriteRenderer,
    private enemies: Entity[]
  ) { }


  use() {
    this.timeSinceLastUse = 0
    if (this.reloadTime <= 0) {
      this.reloadTime = 0.0
      for (const entity of this.enemies) {
        const enemyRectangle = entity.getBoundingRectangle()
        const rectangle = tRectangle.get(this.position.x, this.position.y, tileSize, tileSize)
        if (enemyRectangle) {
          if (doRectanglesOverlap(rectangle, enemyRectangle)) {
            entity.getHitBy(this.position, 5)
          }
        }
      }
    }
  }

  draw() {
    const using = this.timeSinceLastUse < 0.05
    let sprite = TextureAtlas.knife
    if (using) sprite = this.animationPlayer.currentSprite()
    this.spriteRenderer.sprite(this.position.x, this.position.y, sprite, this.direction < 0)
  }

  update(delta: number) {
    this.timeSinceLastUse += delta
    this.reloadTime -= delta
    this.animationPlayer.update(delta)
  }

}

const animations = {
  useKnife: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.knifeUse0),
      new Frame(0.1, TextureAtlas.knifeUse1)
    ])
}