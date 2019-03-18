import { SpriteRenderer } from "./SpriteRenderer"
import { BulletSystem } from "./BulletSystem"
import { ScreenShaker } from "./ScreenShake"
import { Entity } from "./entity"
import { Bullet } from "./Bullet"
import { Vector2 } from "./Vector2"
import { Weapon } from "./weapons"
import { TextureAtlas } from "./TextureAtlas"
import { worldWidth } from "./world"
import { doRectanglesOverlap } from "./collission"
import { AudioIdentifier, AudioSystem } from "./AudioSystem";
import { useMachineGun } from "./sounds";
import { tRectangle } from "./temporaryObjects";

export class MachineGun implements Weapon {

  position = new Vector2
  reloadTime = 0
  direction = -1
  private timeSinceLastUse = Infinity

  private shootSound: AudioIdentifier

  constructor(
    private spriteRenderer: SpriteRenderer,
    private bulletSystem: BulletSystem,
    private screenShaker: ScreenShaker,
    private enemies: Entity[],
    private audioSystem: AudioSystem
  ) {
    this.shootSound = this.audioSystem.load(useMachineGun)
    this.update(0)
  }

  use() {
    if (this.reloadTime <= 0) {
      this.reloadTime = 0.08

      this.audioSystem.play(this.shootSound)
      const bullet = new MachineGunBullet(this.spriteRenderer, this.bulletSystem, this.enemies)
      bullet.position.x = this.position.x
      bullet.position.y = this.position.y + 6

      bullet.velocity.x = 260 * this.direction
      bullet.velocity.y = (Math.random() * 140) - 70
      this.bulletSystem.add(bullet)
      if (this.screenShaker.getTrauma() < 0.3) {
        this.screenShaker.addTrauma(0.3)
      }
      this.screenShaker.addTrauma(0.1)
      this.timeSinceLastUse = 0
    }
  }

  draw() {

    if (this.timeSinceLastUse < 0.045) {
      let x = this.position.x
      if (this.direction > 0) x += 13
      this.spriteRenderer.sprite(x, this.position.y + 4, TextureAtlas.flare1, this.direction < 0)
    }

    this.spriteRenderer.sprite(this.position.x, this.position.y, TextureAtlas.machineGun, this.direction < 0)
  }

  update(delta: number) {
    this.timeSinceLastUse += delta
    this.reloadTime -= delta
  }
}


export class MachineGunBullet implements Bullet {
  sprite = TextureAtlas.machineGunBullet
  position = new Vector2
  velocity = new Vector2

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

      const bulletRectangle = tRectangle.get(this.position.x, this.position.y, this.sprite.width, this.sprite.height)
      if (doRectanglesOverlap(rectangle, bulletRectangle)) {
        entity.getHitBy(this.position, 5)
        this.bulletSystem.remove(this)
        return
      }
    }
  }
  draw() {
    this.spriteRenderer.sprite(this.position.x, this.position.y, this.sprite)
  }
}