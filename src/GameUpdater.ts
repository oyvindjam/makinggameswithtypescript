import { gameUpdate, gameDraw } from "./main";

export class GameUpdater {
  private accumulatedTime = 0

  constructor(
    readonly timeStepSeconds: number,
    private maxUpdatesAllowed: number
  ) { }

  update(delta: number) {
    this.accumulatedTime += delta
    if (this.accumulatedTime > this.timeStepSeconds * this.maxUpdatesAllowed) {
      this.accumulatedTime = this.timeStepSeconds * this.maxUpdatesAllowed
    }

    while (this.accumulatedTime >= this.timeStepSeconds) {
      this.accumulatedTime -= this.timeStepSeconds
      gameUpdate(this.timeStepSeconds)
    }
    gameDraw()
  }
}