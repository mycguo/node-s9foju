import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import ProfileSnmpCredentials from '../device-management-data/interfaces/profile-snmp-credentials';

export interface CredentialStorageState extends EntityState<ProfileSnmpCredentials> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'CredentialStorage', resettable: true })
export class CredentialStorageStore extends EntityStore<CredentialStorageState> {

  constructor() {
    super();
  }

}

