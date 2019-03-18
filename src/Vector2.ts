import { tVector2 } from "./temporaryObjects";

export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) { }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const length = this.length()
    if (length == 0) return
    this.x /= length
    this.y /= length
  }

  set(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export function dot(a: Vector2, b: Vector2) {
  return a.x*b.x+a.y*b.y
}

export function subtract(a: Vector2, b: Vector2) {
  return tVector2.get(a.x-b.x, a.y-b.y)
}