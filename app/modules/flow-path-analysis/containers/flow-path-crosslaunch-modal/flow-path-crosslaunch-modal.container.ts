import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { PeekDevicesService } from '../../services/peek-devices.service';
import { TimeUtilsService } from '../../../../services/time-utils/time-utils.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import FilterChange from '../../../grid/components/filters/filter-change';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import PeekDrilldownRequest from '../../../../../../../project_typings/client/nxComponents/laFlowPathAnalysis/PeekDrilldownRequest';
import PeekDevice from '../../models/peek-device';
import { FilterService } from '../../../filter/services/filter/filter.service';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import { FilterValue } from '../../../filter/interfaces/filter-value';

@UntilDestroy()
@Component({
  selector: 'nx-flow-path-crosslaunch-modal-container',
  template: `
    <nx-loading
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [showContent]="true"
      [contentTemplate]="contentTemplate">
      <ng-template #contentTemplate>
        <nx-flow-path-crosslaunch-modal
          [data]="data$ | async"
          [crosslaunchData]="crosslaunchData"
          [flexFilters]="flexFilters"
          [filterOptions]="filterOptions"
          [highlightIds]="[deviceId]"
          [statusBarData]="statusBarData$ | async"
          (cancelClicked)="cancelClicked.emit()"
          (columnSortChanged)="columnSortChanged($event)"
          (columnFilterChanged)="columnFilterChanged($event)"
          (globalSearchTermChanged)="globalSearchTermChanged($event)"
          (flexFilterChanged)="flexFilterChanged($event)"
        ></nx-flow-path-crosslaunch-modal>
      </ng-template>
    </nx-loading>
  `
})
export class FlowPathCrosslaunchModalContainer implements OnChanges, OnDestroy {

  @Input() drilldown: PeekDrilldownRequest;
  @Input() deviceId: string;
  @Output() cancelClicked = new EventEmitter<void>();

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  data$: Observable<PeekDevice[]>;
  statusBarData$: Observable<GridStatusBar>;

  crosslaunchData: Array<{key: string, value: string}>;
  flexFilters: FilterValue;

  readonly filterOptions = [
    LaFilterSupportEnums.SITE,
    LaFilterSupportEnums.TAG,
    LaFilterSupportEnums.REGION
  ];

  constructor(
    public dialog: DialogService,
    private peekDeviceService: PeekDevicesService,
    private timeUtilsService: TimeUtilsService,
    private filterService: FilterService
  ) {
    this.isLoading$ = this.peekDeviceService.selectLoading();
    this.error$ = this.peekDeviceService.selectError();
    this.data$ = this.peekDeviceService.selectFilteredGroups();
    this.statusBarData$ = this.peekDeviceService.selectStatusBarData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.drilldown &&
      changes.drilldown.currentValue !== changes.drilldown.previousValue &&
      !changes.drilldown.isFirstChange()
    ) {
      if (this.drilldown.filter?.flexSearch) {
        // build pre selected filters from passed search string
        const preSelected = this.filterService.buildFilterValueFromSearchString(this.drilldown.filter.flexSearch);
        // filter out all filters not supported by current config
        const filteredFilters = Object.keys(preSelected).reduce((acc, key) => {
          if (this.filterOptions.includes(key as LaFilterSupportEnums)) {
            acc[key] = preSelected[key];
          }
          return acc;
        }, <FilterValue>{});

        // reassign request flex search with filtered flex search and set pre selected filters for modal
        this.drilldown.filter.flexSearch = this.filterService.buildFlexSearchString(filteredFilters);
        this.flexFilters = filteredFilters;
      }
      this.getPeekDevices(this.drilldown);
      this.crosslaunchData = this.getCrosslaunchData(this.drilldown);
    }

  }

  ngOnDestroy() {
    this.peekDeviceService.reset();
  }

  columnFilterChanged(filterChange: FilterChange[]): void {
    filterChange.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.peekDeviceService.setFilter(filter.field, filter.term);
      }
    });
  }

  globalSearchTermChanged(searchTerm: string): void {
    this.peekDeviceService.setGlobalFilter(searchTerm);
  }

  columnSortChanged(change: GridColumnSort): void {
    if (change === void 0) {
      this.peekDeviceService.clearSort();
    } else {
      this.peekDeviceService.setSortBy(change.colId, change.sort, change.customSortFn);
    }
  }

  flexFilterChanged(filter: FilterValue): void {
    if (filter !== void 0) {
      Object.assign(this.drilldown, {filter: {flexSearch: this.filterService.buildFlexSearchString(filter)}});
    }
    this.getPeekDevices(this.drilldown);
  }

  private getPeekDevices(drilldown: PeekDrilldownRequest): void {
    this.peekDeviceService.getPeekDevices(drilldown)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe();
  }

  private getCrosslaunchData(drilldown: PeekDrilldownRequest): Array<{key: string, value: string}> {
    const crosslaunchDataMap = {
      endTime: 'Time',
      protocol: 'Protocol',
      clientIp: 'Client IP',
      serverIp: 'Server IP',
      sourceIp: 'Src IP',
      destinationIp: 'Dst IP',
      sourcePort: 'Src port',
      destinationPort: 'Dst port',
      port: 'Port'
    };
    return Object.keys(crosslaunchDataMap).reduce((acc, key) => {
      let value = drilldown?.linkInfo[key];
      if (value !== void 0) {
        if (key === 'endTime') {
          value = this.timeUtilsService.formatDate(value);
        }
        acc.push({key: crosslaunchDataMap[key], value: value});
      }
      return acc;
    }, []);
  }

}
