import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ReportsManagementStore, ReportsManagementState } from './reports-management.store';
import {ReportsManagement} from '../models/reports-management';

@Injectable({ providedIn: 'root' })
export class ReportsManagementQuery extends QueryEntity<ReportsManagementState, ReportsManagement, string> {

  constructor(protected store: ReportsManagementStore) {
    super(store);
  }

}
