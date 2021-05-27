import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CredentialStorageStore, CredentialStorageState } from './credential-storage.store';

@Injectable({ providedIn: 'root' })
export class CredentialStorageQuery extends QueryEntity<CredentialStorageState> {

  constructor(protected store: CredentialStorageStore) {
    super(store);
  }

}
