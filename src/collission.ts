import { Vector2, dot, subtract } from "./Vector2"
import { Rectangle } from "./Rectangle"
import { Line } from "./Line"
import { tRectangle, tVector2, tLine } from "./temporaryObjects";
import { findLineIntersection } from "./findLineIntersection";

export function resolveCollision(
  oldPosition: Vector2, newPosition: Vector2,
  width: number, height: number, line: Line
) {
  const intersection = detectCollision(oldPosition, newPosition, width, height, line)
  if (!intersection) return null

  const lineDirection = subtract(line.p1, line.p0)
  lineDirection.normalize()

  const xContrib = Math.abs(lineDirection.y)
  const yContrib = Math.abs(lineDirection.x)
  const result = tVector2.get(
    ((newPosition.x) * (1 - xContrib) + (intersection.x * xContrib)),
    ((newPosition.y) * (1 - yContrib) + (intersection.y * yContrib))
  )

  const lineNormal = tVector2.get(lineDirection.y, -lineDirection.x)
  result.x += lineNormal.x * 0.01
  result.y += lineNormal.y * 0.01

  return result
}

export function detectCollision(
  oldPosition: Vector2, newPosition: Vector2,
  width: number, height: number, line: Line
) {
  const lineDirection = subtract(line.p1, line.p0)
  lineDirection.normalize()
  const lineNormal = tVector2.get(lineDirection.y, -lineDirection.x)

  const oldToNew = subtract(newPosition, oldPosition)
  oldToNew.normalize()

  if (dot(oldToNew, lineNormal) > 0) return null

  const halfWidth = width / 2
  const halfHeight = height / 2

  const extraLength = Math.abs(lineDirection.x * halfWidth) + 
    Math.abs(lineDirection.y * halfHeight)

  const start = tVector2.get(
    line.p0.x - extraLength * lineDirection.x,
    line.p0.y - extraLength * lineDirection.y
  )
  const end = tVector2.get(
    line.p1.x + extraLength * lineDirection.x,
    line.p1.y + extraLength * lineDirection.y
  )

  const size = Math.abs(lineNormal.x * halfWidth) +
    Math.abs(lineNormal.y * halfHeight)
  
  const p1 = tVector2.get(
    start.x + lineNormal.x * size,
    start.y + lineNormal.y * size
  )
  const p2 = tVector2.get(
    end.x + lineNormal.x * size,
    end.y + lineNormal.y * size
  )

  const extendedLine = tLine.get(p1, p2)

  const oldPositionCenter = tVector2.get(
    oldPosition.x + width / 2,
    oldPosition.y + height / 2
  )
  const newPositionCenter = tVector2.get(
    newPosition.x + width / 2,
    newPosition.y + height / 2
  )
  const fromOldCenterToNewCenter = tLine.get(
    oldPositionCenter,
    newPositionCenter
  )
  const intersection = findLineIntersection(
    extendedLine,
    fromOldCenterToNewCenter
  )
  if (!intersection) return false

  return tVector2.get(
    intersection.x - halfWidth,
    intersection.y - halfHeight
  )
}

export function doRectanglesOverlap(r0: Rectangle, r1: Rectangle) {
  const expandedR1 = tRectangle.get(
    r1.x - r0.width / 2,
    r1.y - r0.height / 2,
    r1.width + r0.width,
    r1.height + r0.height
  )
  const centerR0 = tVector2.get(
    r0.x + r0.width / 2,
    r0.y + r0.height / 2
  )
  return isPointInsideRectangle(centerR0, expandedR1)
}

export function isPointInsideRectangle(point: Vector2, rect: Rectangle) {
  return point.x >= rect.x && point.x <= rect.x + rect.width &&
    point.y >= rect.y && point.y <= rect.y + rect.height
}