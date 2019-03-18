import { Animation, AnimationMode } from "./Animation"

export class AnimationPlayer {
  private time = 0
  private currentFrame = 0

  constructor(
    public animation: Animation
  ) { }

  update(delta: number) {
    this.time += delta
    const frame = this.animation.frames[this.currentFrame]
    if (this.time >= frame.seconds) {
      this.time -= frame.seconds
      this.nextFrame()
    }
  }

  private nextFrame() {
    this.currentFrame++
    if (this.currentFrame >= this.animation.frames.length) {
      if (this.animation.mode == AnimationMode.once) {
        this.currentFrame = this.animation.frames.length - 1
      }
      else this.currentFrame = 0
    }
  }

  setAnimation(animation: Animation) {
    this.animation = animation
    this.reset()
  }

  currentSprite() {
    if (this.currentFrame >= this.animation.frames.length) {
      throw new Error("Tried to get frame outside the range of the animation")
    }
    return this.animation.frames[this.currentFrame].sprite
  }

  reset() {
    this.time = 0
    this.currentFrame = 0
  }
}

export function switchAnimation(
  animation: Animation,
  animationPlayer: AnimationPlayer
) {
  if (animationPlayer.animation != animation) {
    animationPlayer.setAnimation(animation)
  }
}