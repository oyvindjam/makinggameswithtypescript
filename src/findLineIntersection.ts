import { Line } from "./Line";
import { tVector2 } from "./temporaryObjects";

export function findLineIntersection(l0: Line, l1: Line) {
  const divisor =
    (l1.p1.x - l1.p0.x) * (l0.p0.y - l0.p1.y) -
    (l0.p0.x - l0.p1.x) * (l1.p1.y - l1.p0.y)
  if (divisor == 0) return null

  const ta = (
    (l1.p0.y - l1.p1.y) * (l0.p0.x - l1.p0.x) +
    (l1.p1.x - l1.p0.x) * (l0.p0.y - l1.p0.y)
  ) / divisor

  const tb = (
    (l0.p0.y - l0.p1.y) * (l0.p0.x - l1.p0.x) +
    (l0.p1.x - l0.p0.x) * (l0.p0.y - l1.p0.y)
  ) / divisor

  if (ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1) {
    return tVector2.get(
      l0.p0.x + ta * (l0.p1.x - l0.p0.x),
      l0.p0.y + ta * (l0.p1.y - l0.p0.y))
  }
  return null
}