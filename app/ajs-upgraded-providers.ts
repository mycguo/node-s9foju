import {InjectionToken} from '@angular/core';

export const $STATE = new InjectionToken('$state');

export function $stateFactory(i: any) {
  return i.get('$state');
}

export const $stateProvider = {
  provide: $STATE,
  useFactory: $stateFactory,
  deps: ['$injector']
};
