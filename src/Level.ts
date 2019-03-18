import { Rectangle } from "./Rectangle"
import { Vector2 } from "./Vector2"
import { Line } from "./Line";
import { tileSize } from "./world";

export class Level {
  constructor(
    readonly playerStartLocation: Vector2,
    readonly spawnBasketLocations: number[][],
    readonly map: (Rectangle | null)[][],
    readonly collisionLines: Line[]
  ) {
    for (const line of this.collisionLines) {
      line.p0.set(line.p0.x * tileSize, line.p0.y * tileSize)
      line.p1.set(line.p1.x * tileSize, line.p1.y * tileSize)
    }
  }
}