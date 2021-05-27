import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import DeviceSnmpCredentials from './interfaces/device-snmp-credentials';

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'deviceCredentialStore', resettable: true})
export class DeviceManagementDataStore extends Store<DeviceSnmpCredentials> {

  constructor() {
    super({});
  }

}

