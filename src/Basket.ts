import { TextureAtlas } from "./TextureAtlas"
import { Level } from "./Level"
import { Vector2 } from "./Vector2"
import { Weapon } from "./weapons"
import { shuffle } from "./array"
import { doRectanglesOverlap } from "./collission"
import { tileSize } from "./world"
import { Player } from "./Player"
import { tRectangle } from "./temporaryObjects"

export class Basket {
  sprite = TextureAtlas.basket
  constructor(
    public weapon: Weapon,
    public position: Vector2
  ) { }
}

export class BasketPlacer {

  private spawnLocations: Vector2[] = []

  constructor(
    level: Level,
    private playerEntity: Player
  ) {
    for (let row = 0; row < level.spawnBasketLocations.length; row++) {
      for (let column = 0; column < level.spawnBasketLocations[row].length; column++) {
        if (level.spawnBasketLocations[row][column] == 1) {
          this.spawnLocations.push(new Vector2(column * tileSize, row * tileSize))
        }
      }
    }
  }

  randomLocation() {
    const playerRect = tRectangle.get(this.playerEntity.position.x - tileSize, this.playerEntity.position.y - tileSize, tileSize * 3, tileSize * 3)
    const freeLocations = this.spawnLocations.filter(location => !doRectanglesOverlap(playerRect, tRectangle.get(location.x, location.y, tileSize, tileSize)))
    const index = Math.floor(Math.random() * freeLocations.length)
    return freeLocations[index]
  }
}

export class WeaponPicker {

  private index = 0
  private readonly weapons: Weapon[]
  private currentWeapon: Weapon

  constructor(
    weapons: Weapon[]
  ) {
    this.weapons = Array.from(weapons)
    this.currentWeapon = this.weapons[0]
    shuffle(this.weapons)
  }

  nextWeapon(): Weapon {
    let weapon = this.weapons[this.index++]
    if (this.index >= this.weapons.length) {
      shuffle(this.weapons)
      this.index = 0
    }
    if (this.currentWeapon == weapon) {
      weapon = this.nextWeapon()
    }
    this.currentWeapon = weapon

    return weapon
  }
}