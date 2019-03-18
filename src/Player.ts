// If pressing jump right before landing we should be able to use that jump to jump again, (we should not have to release and press the button again)
import { tileSize, worldHeight } from "./world"
import { AudioSystem, AudioIdentifier } from "./AudioSystem"
import { Weapon } from "./weapons"
import { SpriteRenderer } from "./SpriteRenderer"
import { Level } from "./Level"
import { Vector2 } from "./Vector2"
import { doRectanglesOverlap, resolveCollision } from "./collission"
import { Rectangle } from "./Rectangle"
import { playerJump } from "./sounds"
import { ScreenShaker } from "./ScreenShake"
import { ParticleSystem, PhysicsParticle } from "./ParticleSystem"
import { TextureAtlas } from "./TextureAtlas"
import { Entity } from "./entity"
import { submitScore } from "./main"
import { degreesToRadians } from "./math"
import { AnimationPlayer, switchAnimation } from "./AnimationPlayer";
import { AnimationMode, Animation } from "./Animation";
import { Frame } from "./Frame";
import { tRectangle, tVector2 } from "./temporaryObjects";

const niceJumpTime = 0.1
const maxJumpLength = 0.2
const jumpSpeed = 190

export enum Facing {
  left = -1, right = 1
}

// TODO I need to be able to see if I am actually in the air
// TODO It should be possible to fire multiple bullets if we get a really long frame
// TODO the jumping needs to be tuned better
// TODO velocity needs to be something completely different from facing and movement  the movement since we will use it for knockbacks
// TODO do the move stack 

export class Player {
  private timeSinceStartedFalling = 0
  private timeSinceStartedJump = 0
  private jumped = false
  private jumping = false
  private shooting = false
  private maxRunSpeed = 135
  private idle = animations.idle
  private dieAnimation = animations.die
  private run = animations.run
  private fall = animations.fall
  private fly = animations.fly

  private animationPlayer = new AnimationPlayer(this.idle)
  private facingDirection = Facing.left
  readonly position = new Vector2
  readonly velocity = new Vector2
  private jumpSound: AudioIdentifier

  dead: boolean = false
  readonly deathTime: number = 1

  constructor(
    private audioSystem: AudioSystem,
    private level: Level,
    private screenShaker: ScreenShaker,
    private particleSystem: ParticleSystem,
    private renderer: SpriteRenderer,
    private enemies: Entity[],
    private weapon: Weapon,
  ) {
    this.jumpSound = this.audioSystem.load(playerJump)

    this.position.x = level.playerStartLocation.x
    this.position.y = level.playerStartLocation.y
    this.velocity.y = 1
  }


  getBoundingRectangle() {
    const frame = this.animationPlayer.currentSprite()
    return tRectangle.get(this.position.x + 2, this.position.y + 3, frame.width - 5, frame.height - 6)
  }

  private shoot() {
    if (this.dead) return
    this.weapon.use()
  }

  land() {
    if (this.timeSinceStartedFalling > 0.1) {
      this.spawnLandParticles()
      this.screenShaker.addTrauma(0.3)
    }
    this.timeSinceStartedFalling = 0
    this.velocity.y = 0
    this.jumped = false
  }

  spawnLandParticles() {
    const particles = Math.floor(5 + Math.random() * 5)
    for (let i = 0; i < particles; i++) {
      const angle = degreesToRadians(-90 + (Math.random() * 50 - 25))
      const speed = 40 + (Math.random() * 10 - 5)

      const velocity = new Vector2(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      )

      const position = new Vector2(this.position.x + tileSize / 2, this.position.y + tileSize)

      const lifeTime = 0.05 + Math.random() * 0.15
      const particle = new PhysicsParticle(this.renderer, TextureAtlas.particle0, lifeTime, position, velocity)
      this.particleSystem.spawn(particle)
    }
  }

  startJump() {
    if (this.dead) return
    if (this.jumped) return

    if (this.timeSinceStartedFalling < niceJumpTime) {
      this.velocity.y = -jumpSpeed
      this.jumped = true
      this.jumping = true
      this.audioSystem.play(this.jumpSound)
    }
  }

  stopJump() {
    this.timeSinceStartedJump = 0
    this.jumping = false
  }

  startShoot() {
    this.shooting = true
  }

  stopShoot() {
    this.shooting = false
  }

  startLeft() {
    if (this.dead) return
    this.velocity.x = -this.maxRunSpeed
    this.facingDirection = Facing.left
  }
  stopLeft() {
    if (this.dead) return
    if (this.velocity.x < 0) this.velocity.x = 0
  }
  startRight() {
    if (this.dead) return
    this.velocity.x = this.maxRunSpeed
    this.facingDirection = Facing.right
  }
  stopRight() {
    if (this.velocity.x > 0) this.velocity.x = 0
  }

  update(delta: number) {

    if (this.dead) {
      this.animationPlayer.update(delta)
      switchAnimation(this.dieAnimation, this.animationPlayer)
    }

    if (this.velocity.y > 0) {
      this.timeSinceStartedFalling += delta
    }
    if (this.jumping) {
      this.timeSinceStartedJump += delta
      if (this.timeSinceStartedJump < maxJumpLength) {
        this.velocity.y = -jumpSpeed
      }
    }
    if (this.shooting) {
      this.shoot()
    }

    if (!this.dead) {
      if (this.velocity.x == 0) switchAnimation(this.idle, this.animationPlayer)
      else switchAnimation(this.run, this.animationPlayer)
      if (this.velocity.y > 0) switchAnimation(this.fall, this.animationPlayer)
      if (this.velocity.y < 0) switchAnimation(this.fly, this.animationPlayer)
    }

    this.animationPlayer.update(delta)


    const oldPosition = tVector2.get(this.position.x, this.position.y)
    this.velocity.y += 550 * delta
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta

    for (let line of this.level.collisionLines) {
      const newPosition = resolveCollision(oldPosition, this.position, tileSize, tileSize, line)
      if (newPosition) {
        if (newPosition.y < this.position.y) {
          this.land()
        }
        this.position.set(newPosition.x, newPosition.y)
      }
    }


    if (this.position.y > worldHeight) {
      oldPosition.y = this.position.y - worldHeight
      this.position.y = 0
    }

    this.weapon.position.x = this.position.x + tileSize * this.facingDirection
    this.weapon.position.y = this.position.y
    this.weapon.direction = this.facingDirection
    this.weapon.update(delta)

    if (!this.dead) {
      for (const enemy of this.enemies) {
        const enemyRectangle = enemy.getBoundingRectangle()
        if (enemyRectangle) {
          const rectangle = new Rectangle(this.position.x, this.position.y, this.animationPlayer.currentSprite().width, this.animationPlayer.currentSprite().height)
          if (doRectanglesOverlap(rectangle, enemyRectangle)) {
            this.die()
          }
        }
      }
    }
  }

  die() {
    if (this.dead) return
    // TODO when the player dies it should be tossed in the opposite direction 
    submitScore()
    this.velocity.x = 0
    this.velocity.y = 0
    this.shooting = false
    this.jumping = false
    this.dead = true
  }

  draw() {
    const sprite = this.animationPlayer.currentSprite()
    drawVerticalyWrapped(this.position.x, this.position.y, sprite, this.renderer, this.facingDirection == Facing.right)
    this.weapon.draw()
  }

  setWeapon(weapon: Weapon) {
    this.weapon = weapon
    this.weapon.position.x = this.position.x + tileSize * this.facingDirection
    this.weapon.position.y = this.position.y
    this.weapon.direction = this.facingDirection
    this.weapon.update(0)
  }
}

export function drawVerticalyWrapped(x: number, y: number, sprite: Rectangle, renderer: SpriteRenderer, mirrored: boolean = false) {
  renderer.sprite(x, y, sprite, mirrored)
  if (y + sprite.height > worldHeight) {
    const overflow = y + sprite.height - worldHeight
    renderer.sprite(x, -sprite.height + overflow, sprite, mirrored)
  }
  if (y < 0) {
    renderer.sprite(x, worldHeight - Math.abs(y), sprite, mirrored)
  }
}




const animations = {
  run: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.guyRun0),
      new Frame(0.1, TextureAtlas.guyRun1),
      new Frame(0.1, TextureAtlas.guyRun2),
      new Frame(0.1, TextureAtlas.guyRun3)
    ]),
  idle: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.guy0),
      new Frame(0.1, TextureAtlas.guy1),
      new Frame(0.1, TextureAtlas.guy2),
      new Frame(0.1, TextureAtlas.guy3),
      new Frame(0.1, TextureAtlas.guy4),
      new Frame(0.1, TextureAtlas.guy5)
    ]),

  fall: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.guyFall0)
    ]),

  fly: new Animation(AnimationMode.loop,
    [
      new Frame(0.1, TextureAtlas.guyFly0)
    ]),

  die: new Animation(AnimationMode.once,
    [
      new Frame(0.1, TextureAtlas.guyDie0),
      new Frame(0.1, TextureAtlas.guyDie1),
      new Frame(0.1, TextureAtlas.guyDie2),
    ])
}