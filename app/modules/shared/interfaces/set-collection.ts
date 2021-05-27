/**
 * SetCollection
 * @description Subset of methods and properties from the EcmaScript specification for Set
 */
export interface SetCollection<U> {
  size: number;
  add(value: U): U;
  clear(): undefined;
  delete(value: U): boolean;
  has(value: U): boolean;
  toArray(): Array<U>;
  withArray(list: Array<U>): void;
}
