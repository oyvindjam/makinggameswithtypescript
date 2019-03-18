export class ObjectPool<T, V extends any[]> {
  private objects: T[] = []
  constructor(
    private newObject: (...v: V) => T,
    private initializeObject: (t: T, ...v: V) => void
  ) {}

  get(...args: V): T {
    let object = this.objects.pop()
    if (object == null) return this.newObject(...args)
    this.initializeObject(object, ...args)
    return object
  }

  add(object: T) {
    this.objects.push(object)
  }
}