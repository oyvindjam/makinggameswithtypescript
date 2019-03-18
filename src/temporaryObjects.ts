import { ObjectPoolManager } from "./ObjectPoolManager";
import { ObjectPool } from "./ObjectPool";
import { Vector2 } from "./Vector2";
import { Rectangle } from "./Rectangle";
import { Line } from "./Line";

export const tVector2 = new ObjectPoolManager(
  new ObjectPool(
    (x: number, y: number) => new Vector2(x, y),
    (vector, x: number, y: number) => {
      vector.x = x
      vector.y = y
    }
  )
)

export const tRectangle = new ObjectPoolManager(
  new ObjectPool(
    (x: number, y: number, width: number, height: number) => new Rectangle(x, y, width, height),
    (rectangle, x: number, y: number, width: number, height: number) => {
      rectangle.x = x
      rectangle.y = y
      rectangle.width = width
      rectangle.height = height
    }
  )
)

export const tLine = new ObjectPoolManager(
  new ObjectPool(
    (p0: Vector2, p1: Vector2) => new Line(p0, p1),
    (rectangle, p0: Vector2, p1: Vector2) => {
      rectangle.p0 = p0
      rectangle.p1 = p1
    }
  )
)

const temporaryPools = [
  tVector2, tRectangle, tLine
]

export function releaseTemporaryPools() {
  for (const pool of temporaryPools) pool.release()
}