import { ObjectPool } from "./ObjectPool";

export class ObjectPoolManager<T, V extends any[]> {
    private objects: T[] = []
    constructor(
      private objectPool: ObjectPool<T, V>
    ) {}
  
    get(...args: V) {
      const object = this.objectPool.get(...args)
      this.objects.push(object)
      return object
    }
  
    release() {
      while(true) {
        let object = this.objects.pop()
        if (object == undefined) return
        this.objectPool.add(object)
      }
    }
  }