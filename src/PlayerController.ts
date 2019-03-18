import { Player } from "./Player"
import { Controller } from "./Controller"

export class PlayerController implements Controller {

  constructor(
    private player: Player
  ) { }

  pressLeft() { this.player.startLeft() }
  releaseLeft() { this.player.stopLeft() }

  pressRight() { this.player.startRight() }
  releaseRight() { this.player.stopRight() }

  pressActionButton1() { this.player.startJump() }
  releaseActionButton1() { this.player.stopJump() }

  pressActionButton2() { this.player.startShoot() }
  releaseActionButton2() { this.player.stopShoot() }
}