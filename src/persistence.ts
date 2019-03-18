export class Persistence {

  private readonly allowStorageKey = "allowStorage"
  allowStorage = false

  private readonly scoreKey = "score"
  private score: number | null = null

  constructor() {
    this.allowStorage = window.localStorage.getItem(this.allowStorageKey) != null
  }

  getScore() {
    if (!this.allowStorage) return 0
    if (this.score == null) {
      const score = window.localStorage.getItem(this.scoreKey)
      if (score == null) return 0
      this.score = parseInt(score)
    }
    return this.score
  }

  saveScore(score: number) {
    this.score = score
    if (!this.allowStorage) return
    window.localStorage.setItem(this.scoreKey, score.toString())
  }

  userAllowedStorage() {
    this.allowStorage = true
    window.localStorage.setItem(this.allowStorageKey, "yes")
    if (this.score != null) this.saveScore(this.score)
  }
}