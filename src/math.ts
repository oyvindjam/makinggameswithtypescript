export function degreesToRadians(degrees: number) {
  return degrees * ((2 * Math.PI) / 360)
}

export function radiansToDegrees(radians: number) {
  return radians * (360 / (2 * Math.PI))
}