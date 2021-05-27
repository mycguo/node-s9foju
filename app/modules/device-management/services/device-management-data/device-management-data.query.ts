import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DeviceManagementDataStore } from './device-management-data.store';
import DeviceSnmpCredentials from './interfaces/device-snmp-credentials';

@Injectable({ providedIn: 'root' })
export class DeviceManagementDataQuery extends Query<DeviceSnmpCredentials> {

  constructor(protected store: DeviceManagementDataStore) {
    super(store);
  }

}
