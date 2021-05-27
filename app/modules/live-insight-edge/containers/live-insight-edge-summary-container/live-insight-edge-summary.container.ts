import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseContainer } from '../../../../containers/base-container/base.container';
import WidgetDataProvider from '../../../dashboard/containers/dashboard-widget/widget-data-provider';
import { ReportWidgetDataProviderService } from '../../../dashboard/services/report-widget-data-provider/report-widget-data-provider.service';
import { LiveInsightEdgeSummaryPageService } from '../../services/live-insight-edge-summary-page/live-insight-edge-summary-page.service';
import LastNDays from '../../../../services/time-utils/last-n-days';
import { DashboardDataRequest } from '../../../dashboard/containers/dashboard-widget/dashboard-data-request';
import { TimeUtilsService } from '../../../../services/time-utils/time-utils.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FlexFilterExpressionModel } from '../../../../services/page-filter/flex-filter-expression.model';
import {
  FlexFilterProviderToken
} from '../../../../services/page-filter/flex-filter-provider.model';
import { LiveInsightEdgeFilterForm } from '../../services/live-insight-edge-filter/live-insight-edge-filter-form';
import { FilterService } from '../../../filter/services/filter/filter.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import DetailedError from '../../../shared/components/loading/detailed-error';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';

@UntilDestroy()
@Component({
  selector: 'nx-live-insight-edge-summary-container',
  template: `
    <nx-live-insight-edge-summary
      [widgetTimeLabel]="widgetTimeRange?.label"
      [liveNaConnectionError]="connectionError"
      [liveNaErrorModel]="(pageService.selectPageState() | async)?.liveNaConnectionCustomErrorMessage"
      [isLiveNaConnectionChecked]="(pageService.selectPageState() | async)?.isLiveNaConnectionChecked"
      [viewPreferences]="(pageService.selectPageState() | async).viewPreferences"
      (filterUpdate)="handleFilterUpdate($event)"
    ></nx-live-insight-edge-summary>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `],
  providers: [
    { provide: WidgetDataProvider, useExisting: ReportWidgetDataProviderService },
    { provide: FlexFilterProviderToken, useExisting: LiveInsightEdgeSummaryPageService},
    LiveInsightEdgeSummaryPageService,
    FilterService
  ]
})
export class LiveInsightEdgeSummaryContainer extends BaseContainer<any>
  implements OnInit, OnDestroy {

  widgetTimeRange: LastNDays;
  connectionError: DetailedError;

  constructor(private widgetDataProvider: ReportWidgetDataProviderService,
              public cd: ChangeDetectorRef,
              public pageService: LiveInsightEdgeSummaryPageService,
              private timeUtils: TimeUtilsService,
              private filterService: FilterService
  ) {
    super(cd);
  }

  ngOnInit(): void {
    this.pageService.selectPageState()
      .pipe(
        untilDestroyed(this),
        tap((pageState) => {
          if (pageState.liveNaConnectionError != null) {
            this.connectionError = Object.assign(pageState.liveNaConnectionError, {title: void 0});
          }
        }),
        switchMap((pageState) => {
          if (pageState.flexFilters == null || !pageState.isLiveNaConnectionChecked ||
              pageState.liveNaConnectionError != null
          ) {
            return of([]);
          }
          const flexFilterString = pageState.flexFilterString;
          const reportRequests = this.generateReportRequests(flexFilterString);
          return this.widgetDataProvider.requestData(reportRequests);
        }),
        catchError((err) => throwError(err))
      )
      .subscribe();
    // send initial empty filter state
    this.handleFilterUpdate({ flexSearch: {} });
  }

  handleFilterUpdate(filterUpdate: LiveInsightEdgeFilterForm): void {
    const filterEntries = filterUpdate?.flexSearch;
    if (filterEntries == null) {
      return;
    }
    const flexFilterModels = Object.keys(filterEntries).map((filterId: LaFilterSupportEnums) => {
      return <FlexFilterExpressionModel> {
        key: filterId,
        values: filterEntries[filterId],
        flexSearch: this.filterService.buildFlexSearchString({[filterId]: filterEntries[filterId]})
      };
    });
    this.pageService.setPageState({
      flexFilters: flexFilterModels,
      flexFilterString: this.filterService.buildFlexSearchString(filterUpdate.flexSearch)
    });
  }

  private generateReportRequests(flexSearch: string): Array<DashboardDataRequest> {
    const currentDate = new Date();
    const roundedDate = this.timeUtils.roundDownToNearestHour(currentDate);
    this.widgetTimeRange = new LastNDays(30, roundedDate);
    return this.pageService.getDashboardDataRequests(this.widgetTimeRange.startTime,
      this.widgetTimeRange.currentTime, flexSearch);
  }

  ngOnDestroy(): void {
  }
}
