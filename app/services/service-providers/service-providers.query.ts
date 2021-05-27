import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ServiceProvidersStore, ServiceProvidersState } from './service-providers.store';

@Injectable({ providedIn: 'root' })
export class ServiceProvidersQuery extends QueryEntity<ServiceProvidersState> {

  constructor(protected store: ServiceProvidersStore) {
    super(store);
  }

}
