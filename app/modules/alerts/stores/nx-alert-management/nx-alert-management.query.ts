import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { NxAlertManagementStore } from './nx-alert-management.store';
import {NxAlertManagementState} from './nx-alert-management-state';
import NxAlertManagement from '../../services/nx-alert-management/models/nx-alert-management';
import {NxAlertManagementHierarchical} from '../../services/nx-alert-management/models/nx-alert-management-hierarchical';

@Injectable({ providedIn: 'root' })
export class NxAlertManagementQuery extends QueryEntity<NxAlertManagementState> {

  constructor(protected store: NxAlertManagementStore) {
    super(store);
  }

  getAlert(alertId: string): NxAlertManagement {
    const alert = this.getEntity(alertId); // object w/o class functions
    if (alert == null) {
      return void 0;
    } else if (alert instanceof NxAlertManagementHierarchical) {
      return new NxAlertManagementHierarchical(alert);
    } else {
      return new NxAlertManagement(alert);
    }
  }
}
