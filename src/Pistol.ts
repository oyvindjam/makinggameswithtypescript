import { Weapon } from "./weapons"
import { Vector2 } from "./Vector2"
import { SpriteRenderer } from "./SpriteRenderer"
import { BulletSystem } from "./BulletSystem"
import { Entity } from "./entity"
import { TextureAtlas } from "./TextureAtlas"
import { worldWidth } from "./world"
import { doRectanglesOverlap } from "./collission"
import { Bullet } from "./Bullet"
import { AudioSystem, AudioIdentifier } from "./AudioSystem";
import { usePistol } from "./sounds";
import { tRectangle } from "./temporaryObjects";

export class Pistol implements Weapon {

  position = new Vector2
  reloadTime = 0
  direction = -1
  private timeSinceLastUse = Infinity

  private sound: AudioIdentifier

  constructor(
    private spriteRenderer: SpriteRenderer,
    private bulletSystem: BulletSystem,
    private enemies: Entity[],
    private audioSystem: AudioSystem
  ) {
    this.update(0)
    this.sound = this.audioSystem.load(usePistol)
  }

  use() {
    if (this.reloadTime <= 0) {
      this.audioSystem.play(this.sound)
      this.reloadTime = 0.30
      const bullet = new PistolBullet(this.spriteRenderer, this.bulletSystem, this.enemies)
      bullet.position.x = this.position.x
      bullet.position.y = this.position.y + 6
      bullet.velocity.x = 260 * this.direction
      this.bulletSystem.add(bullet)
      this.timeSinceLastUse = 0
    }
  }

  draw() {
    if (this.timeSinceLastUse < 0.1) {
      let x = this.position.x
      if (this.direction > 0) x += 13
      this.spriteRenderer.sprite(x, this.position.y + 5, TextureAtlas.flare0, this.direction < 0)
    }
    this.spriteRenderer.sprite(this.position.x, this.position.y, TextureAtlas.pistol, this.direction < 0)
  }

  update(delta: number) {
    this.timeSinceLastUse += delta
    this.reloadTime -= delta
  }
}


export class PistolBullet implements Bullet {

  position = new Vector2
  velocity = new Vector2
  sprite = TextureAtlas.pistolBullet

  constructor(
    private spriteRenderer: SpriteRenderer,
    private bulletSystem: BulletSystem,
    private enemies: Entity[]
  ) { }

  update(delta: number): void {
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta

    if (this.position.x + this.sprite.width < 0 || this.position.x > worldWidth) {
      this.bulletSystem.remove(this)
      return
    }
    for (const entity of this.enemies) {
      const rectangle = entity.getBoundingRectangle()
      if (rectangle == null) continue
      const bulletRectangle = tRectangle.get(this.position.x, this.position.y, this.sprite.width, this.sprite.height)

      if (doRectanglesOverlap(rectangle, bulletRectangle)) {
        this.bulletSystem.remove(this)
        entity.getHitBy(this.position, 5)
        return
      }
    }
  }

  draw(): void {
    this.spriteRenderer.sprite(this.position.x, this.position.y, this.sprite, this.velocity.x < 0)
  }
}