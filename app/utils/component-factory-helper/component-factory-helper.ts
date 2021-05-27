import {Type} from '@angular/core';
import {Observable, Subject} from 'rxjs';

export class ComponentFactoryHelper {
  public component: Type<any>;
  public params: {};

  private _outputs: { [key: string]: Subject<any> } = {};

  constructor(component: Type<any>,
              params = {},
              outputs: Array<string> = []) {
    this.component = component;
    this.params = params;
    outputs.forEach((name: string) => {
      this._outputs[name] = new Subject<any>();
    });
  }

  cleanup(): void {
    Object.entries(this._outputs).forEach(([key, value]: [string, Subject<any>]) => {
      value.complete();
    });
  }
  getOutputKeys(): Array<string> {
    return Object.keys(this._outputs);
  }

  emitOutput(key: string, value: any): void {
    if (this._outputs[key] !== void 0) {
      this._outputs[key].next(value);
    }
  }

  getOutput(key: string): Observable<any> {
    if (this._outputs[key] !== void 0) {
      return this._outputs[key].asObservable();
    }
  }
}
