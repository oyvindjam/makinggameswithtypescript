import { Weapon } from "./weapons"
import { Vector2 } from "./Vector2"
import { AudioIdentifier, AudioSystem } from "./AudioSystem"
import { SpriteRenderer } from "./SpriteRenderer"
import { BulletSystem } from "./BulletSystem"
import { ScreenShaker } from "./ScreenShake"
import { Entity } from "./entity"
import { useHandCannon } from "./sounds"
import { TextureAtlas } from "./TextureAtlas"
import { Bullet } from "./Bullet"
import { worldWidth } from "./world"
import { doRectanglesOverlap } from "./collission"
import { tRectangle } from "./temporaryObjects";

export class HandCannon implements Weapon {
  position = new Vector2
  reloadTime = 0
  private sound: AudioIdentifier
  direction = -1

  private timeSinceLastUse = Infinity

  constructor(
    private spriteRenderer: SpriteRenderer,
    private bulletSystem: BulletSystem,
    private screenShaker: ScreenShaker,
    private enemies: Entity[],
    private audioSystem: AudioSystem
  ) {
    this.update(0)
    this.sound = this.audioSystem.load(useHandCannon)
  }

  use() {
    if (this.reloadTime <= 0) {
      this.reloadTime = 0.8

      const bullet = new HandCannonBullet(this.spriteRenderer, this.bulletSystem, this.enemies)
      bullet.position.x = this.position.x
      bullet.position.y = this.position.y + 3
      bullet.velocity.x = 260 * this.direction
      this.bulletSystem.add(bullet)
      if (this.screenShaker.getTrauma() < 0.5) {
        this.screenShaker.addTrauma(0.5)
      }
      this.screenShaker.addTrauma(0.2)
      this.audioSystem.play(this.sound)
      this.timeSinceLastUse = 0
    }
  }

  draw() {
    if (this.timeSinceLastUse < 0.15) {
      let x = this.position.x - 2
      if (this.direction > 0) x += 17
      this.spriteRenderer.sprite(x, this.position.y + 3, TextureAtlas.flare2, this.direction < 0)
    }

    this.spriteRenderer.sprite(this.position.x, this.position.y, TextureAtlas.handCannon, this.direction < 0)
  }
  update(delta: number) {
    this.timeSinceLastUse += delta
    this.reloadTime -= delta
  }
}

export class HandCannonBullet implements Bullet {
  sprite = TextureAtlas.handCannonBullet
  position = new Vector2
  velocity = new Vector2
  entitiesHit: Entity[] = []

  constructor(
    private spriteRenderer: SpriteRenderer,
    private bulletSystem: BulletSystem,
    private enemies: Entity[]
  ) { }

  update(delta: number) {
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta

    if (this.position.x + this.sprite.width < 0 || this.position.x > worldWidth) {
      this.bulletSystem.remove(this)
      return
    }

    for (const entity of this.enemies) {
      const rectangle = entity.getBoundingRectangle()
      if (rectangle == null) continue
      if (this.entitiesHit.includes(entity)) continue

      const bulletRectangle = tRectangle.get(this.position.x, this.position.y, this.sprite.width, this.sprite.height)
      if (doRectanglesOverlap(rectangle, bulletRectangle)) {
        entity.getHitBy(this.position, 5)
        this.entitiesHit.push(entity)
      }
    }
  }

  draw(): void {
    this.spriteRenderer.sprite(this.position.x, this.position.y, this.sprite, this.velocity.x < 0)
  }
}