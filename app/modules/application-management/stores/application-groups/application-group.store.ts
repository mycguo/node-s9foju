import { Injectable } from '@angular/core';
import {EntityState, EntityStore, MultiActiveState, StoreConfig} from '@datorama/akita';
import ApplicationGroup from '../../models/application-group';

export interface ApplicationGroupState extends EntityState<ApplicationGroup>, MultiActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'application-group', resettable: true })
export class ApplicationGroupStore extends EntityStore<ApplicationGroupState, ApplicationGroup, string> {
  static readonly INITIAL_STATE = {
    active: []
  };

  constructor() {
    super(ApplicationGroupStore.INITIAL_STATE);
  }

}

