import {SetCollection} from '../../../interfaces/set-collection';
import {Set} from 'typescript-collections';
import {GetValue} from '../../../interfaces/get-value';

/**
 * ChipSet
 * @description An ordered set implementation
 */
export class ChipSet<T extends GetValue> implements SetCollection<T> {
  private set: Set<T>;

  constructor() {
    this.set = new Set<T>((item: T) => item.getValue());
  }

  public get size(): number {
    return this.set.size();
  }

  add(value: T): T {
    return this.set.add(value) ? value : null;
  }

  clear(): undefined {
    this.set.clear();
    return void 0;
  }

  delete(value: T): boolean {
    return this.set.remove(value);
  }

  has(value: T): boolean {
    return this.set.contains(value);
  }

  toArray(): T[] {
    return this.set.toArray();
  }

  withArray(list: T[]): void {
    for (let i = 0; i < list.length; i++) {
      this.add(list[i]);
    }
  }

  /**
   * @description get the last element
   */
  peek(): T {
    return this.toArray()[this.size - 1];
  }

  /**
   * @description remove the last element
   */
  pop(): T {
    const temp: T[] = this.set.toArray();
    const last: T = temp.pop();
    this.set = new Set<T>();
    for (let i = 0; i < temp.length; i++) {
      this.set.add(temp[i]);
    }
    return last;
  }

  forEach(callback: (item: T) => void): void {
    this.set.forEach(callback);
  }
}
