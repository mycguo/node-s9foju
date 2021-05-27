import {Injectable, Type} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private static readonly appPrefix = 'laClientApp';

  constructor() { }

  public getItem<T>(key: string, typeAs: string): T {
    const retrievedValue: string = localStorage.getItem(this.buildKey(key));
    if (retrievedValue === void 0) {
      return void 0;
    }
    let returnValue: any;
    switch (typeAs) {
      case 'boolean':
        returnValue = retrievedValue === 'true';
        break;
      case 'object':
      case 'function': // This would be the type of a class type
        returnValue = JSON.parse(retrievedValue);
        break;
      default:
        returnValue = retrievedValue;
        break;
    }
    return returnValue;
  }

  public setItem<T>(key: string, value: T) {
    const valueToStore: string = typeof value === 'object' ? JSON.stringify(value) : value.toString();
    localStorage.setItem(this.buildKey(key), valueToStore);
  }

  public removeItem(key: string) {
    localStorage.removeItem(this.buildKey(key));
  }

  public removeAll(keys: Array<string>) {
    for (const key of keys) {
      localStorage.removeItem(this.buildKey(key));
    }
  }

  public getKeys(): Array<string> {
    return Object.keys(localStorage);
  }

  private buildKey(key): string {
    return `${LocalStorageService.appPrefix}.${key}`;
  }

}
