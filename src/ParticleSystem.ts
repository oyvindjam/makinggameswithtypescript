import { SpriteRenderer } from "./SpriteRenderer"
import { Vector2 } from "./Vector2"
import { Rectangle } from "./Rectangle"

export class ParticleSystem {

  private particles: PhysicsParticle[] = []

  update(delta: number) {
    this.particles = this.particles.filter(particle => {
      particle.update(delta)
      return particle.isAlive()
    })
  }

  spawn(particle: PhysicsParticle) {
    this.particles.push(particle)
  }

  draw() {
    for (const particle of this.particles) particle.draw()
  }
}

interface Particle {
  update(delta: number): void
  isAlive(): boolean
  draw(): void
}



export class PhysicsParticle implements Particle {
  private time = 0
  private position = new Vector2(0, 0)
  private velocity = new Vector2(0, 0)
  private readonly gravity = 120

  constructor(
    private spriteRenderer: SpriteRenderer,
    private sprite: Rectangle,
    private readonly lifetime: number,
    position: Vector2,
    velocity: Vector2,
  ) {
    this.position.x = position.x
    this.position.y = position.y

    this.velocity.x = velocity.x
    this.velocity.y = velocity.y
  }


  update(delta: number) {
    this.time += delta
    this.velocity.y += this.gravity * delta
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
  }

  isAlive() {
    return this.time < this.lifetime
  }

  draw() {
    this.spriteRenderer.sprite(this.position.x, this.position.y, this.sprite)
  }
}