import { Injectable } from '@angular/core';
import {EntityState, EntityStore, MultiActiveState, StoreConfig} from '@datorama/akita';
import CustomApplicationModel from '../../models/custom-application-model';

export interface CustomApplicationState extends EntityState<CustomApplicationModel>, MultiActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'custom-application', resettable: true })
export class CustomApplicationStore extends EntityStore<CustomApplicationState, CustomApplicationModel, string> {
  static readonly INITIAL_STATE = {
    active: []
  };

  constructor() {
    super(CustomApplicationStore.INITIAL_STATE);
  }

}

