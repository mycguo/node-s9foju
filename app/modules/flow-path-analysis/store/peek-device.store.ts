import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import PeekDevice from '../models/peek-device';

export interface PeekDeviceState extends EntityState<PeekDevice> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'peek-device', resettable: true })
export class PeekDeviceStore extends EntityStore<PeekDeviceState> {

  constructor() {
    super();
  }

}

