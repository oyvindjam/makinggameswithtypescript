export class ScreenShaker {
  x = 0
  y = 0

  private trauma = 0
  private shakeTime = 0
  private timeSinceAddedTrauma = 0
  private shakeInterval = 0.03


  addTrauma(trauma: number) {
    this.trauma += trauma
    if (this.trauma > 1) this.trauma = 1
    this.timeSinceAddedTrauma = 0
  }

  getTrauma() {
    return this.trauma
  }

  update(delta: number) {
    this.shakeTime += this.shakeInterval
    if (this.shakeTime >= this.shakeInterval) {
      this.shakeTime = 0
    } 
    else return

    if (this.trauma >= 1) this.trauma = 1
    const maxOffset = 2

    const shake = Math.pow(this.trauma, 2)
    this.x = Math.random() * maxOffset * shake
    this.y = Math.random() * maxOffset * shake

    this.x -= maxOffset / 2
    this.y -= maxOffset / 2

    this.timeSinceAddedTrauma += delta
    this.trauma -= 0.4 * this.timeSinceAddedTrauma
    
    if (this.trauma < 0) this.trauma = 0
  }
}