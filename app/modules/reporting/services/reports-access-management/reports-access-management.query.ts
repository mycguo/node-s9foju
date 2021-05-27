import { Injectable } from '@angular/core';
import { QueryConfig, QueryEntity } from '@datorama/akita';
import {combineLatest, Observable} from 'rxjs';
import { ReportsAccessManagementState } from './models/reports-access-management-state';
import RestrictedReport from '../../models/report-access-management';
import { ReportsAccessManagementStore } from './reports-access-management.store';
import { CommonService } from '../../../../utils/common/common.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReportsAccessManagementQuery extends QueryEntity<ReportsAccessManagementState, RestrictedReport> {

  selectSearch$ = this.select(state => state.ui.searchString);

  constructor(
    private commonService: CommonService,
    protected store: ReportsAccessManagementStore
  ) {
    super(store);
  }

  selectVisibleReports(): Observable<Array<RestrictedReport>> {
    return combineLatest([
      this.selectSearch$,
      this.selectAll()
      ])
      .pipe(
        map(([searchString, reports]) => {
          return this.getVisibleReports(searchString, reports);
        })
      );
  }

  private getVisibleReports(searchString: string, reports: RestrictedReport[]): RestrictedReport[] {
    if (searchString?.trim().length > 0) {
      return reports.filter(report =>
        this.commonService.randomOrderSearch(report.name, searchString) || this.commonService.randomOrderSearch(report.group, searchString)
      );
    }
    return reports;
  }

}
