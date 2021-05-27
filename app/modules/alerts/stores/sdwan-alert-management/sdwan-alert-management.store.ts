import {Injectable} from '@angular/core';
import {EntityStore, StoreConfig} from '@datorama/akita';
import {SdwanAlertManagementState} from './sdwan-alert-management-state';

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'sdwan-alert-management', resettable: true})
export class SdwanAlertManagementStore extends EntityStore<SdwanAlertManagementState> {
  static readonly INITIAL_STATE = {
    active: []
  };

  constructor() {
    super(SdwanAlertManagementStore.INITIAL_STATE);
  }

}

