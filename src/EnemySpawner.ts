import { Entity } from "./entity"
import { SpriteRenderer } from "./SpriteRenderer"
import { Blueberry } from "./Blueberry"
import { Lemon } from "./Lemon"
import { WaterMelon } from "./WaterMelon"
import { Level } from "./Level";

export class EnemySpawner {
  private readonly maxEnemies = 20

  constructor(
    private enemies: Entity[],
    private spriteRenderer: SpriteRenderer,
    private level: Level
  ) { }

  private timeSinceSpawn = 0
  private delay = 1
  update(delta: number) {
    this.timeSinceSpawn += delta
    if (this.enemies.length < this.maxEnemies && this.timeSinceSpawn > this.delay) {
      const enemy = this.randomEnemy()
      enemy.position.x = 90 + 20 * Math.random()
      enemy.position.y = -20
      enemy.direction = Math.random() < 0.5 ? -1 : 1
      this.enemies.push(enemy)
      this.timeSinceSpawn = 0

      this.delay = 0.5 + Math.random()
    }
  }

  randomEnemy() {
    const index = Math.floor(Math.random() * 3)
    if (index == 0) return new Blueberry(this.spriteRenderer, this.level)
    else if (index == 1) return new Lemon(this.spriteRenderer, this.level)
    else return new WaterMelon(this.spriteRenderer, this.level)
  }
}