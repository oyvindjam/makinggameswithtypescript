// TODO is an event system really needed for this game?
export class EventSystem {
  private events: GameEvent[] = []

  update(delta: number) {
    this.events = this.events.filter(gameEvent => {
      gameEvent.timeBeforeCall -= delta
      if (gameEvent.timeBeforeCall <= 0) {
        gameEvent.func()
        return false
      }
      return true
    })
  }

  register(timeBeforeCall: number, func: () => void) {
    const gameEvent = new GameEvent(timeBeforeCall, func)
    for (let i = 0; i < this.events.length; i++) {
      if (timeBeforeCall < this.events[i].timeBeforeCall) {
        this.events.splice(i, 0, gameEvent)
        return
      }
    }
    this.events.push(gameEvent)
  }
}

class GameEvent {
  constructor(
    public timeBeforeCall: number,
    public func: () => void
  ) { }
}