import { Injectable } from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';

export interface ServiceProvidersState extends EntityState<{id: string, name: string}> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'service-providers'})
export class ServiceProvidersStore extends EntityStore<ServiceProvidersState> {

  constructor() {
    super();
  }

  akitaPreAddEntity(serviceProvider: string) {
    return {
      id: serviceProvider,
      name: serviceProvider
    };
  }


}

