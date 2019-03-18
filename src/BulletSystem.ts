import { Bullet } from "./Bullet"


export class BulletSystem {
  private bullets: Bullet[] = []
  private bulletsToRemove: Bullet[] = []

  add(bullet: Bullet) {
    this.bullets.push(bullet)
  }

  update(delta: number) {
    for (const bullet of this.bullets) bullet.update(delta)
    this.removeBulletsToRemove()
  }

  draw() {
    for (const bullet of this.bullets) bullet.draw()
  }

  remove(bullet: Bullet) {
    this.bulletsToRemove.push(bullet)
  }

  private removeBulletsToRemove() {
    for (const bullet of this.bulletsToRemove) {
      const index = this.bullets.indexOf(bullet)
      if (index >= 0) {
        this.bullets.splice(index, 1)
      }
    }
    this.bulletsToRemove = []
  }

}