import { Injectable } from '@angular/core';
import { EntityStore, guid, StoreConfig } from '@datorama/akita';
import { ReportsAccessManagementState } from './models/reports-access-management-state';
import RestrictedReport from '../../models/report-access-management';
import RestrictedReportResponse from '../../models/restricted-report-response';

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'ReportsAccessManagement',
  idKey: '_id',
  resettable: true
})
export class ReportsAccessManagementStore extends EntityStore<ReportsAccessManagementState, RestrictedReport> {

  constructor() {
    super({
      ui: {
        searchString: ''
      }
    });
  }

  setSearch(searchString: string) {
    this.update({ui: {searchString}});
  }

  akitaPreAddEntity(reportInfoValue: Readonly<RestrictedReportResponse>): RestrictedReport {
    return {
      ...reportInfoValue,
      _id: guid()
    };
  }

}

