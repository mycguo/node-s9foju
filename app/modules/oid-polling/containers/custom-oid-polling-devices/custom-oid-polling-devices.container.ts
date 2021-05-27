import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import { CustomOidPollingDevicesService } from '../../services/custom-oid-polling/custom-oid-polling-devices.service';
import FilterChange from '../../../grid/components/filters/filter-change';
import DetailedError from '../../../shared/components/loading/detailed-error';
import CustomOidPollingDevices from '../../services/custom-oid-polling/models/custom-oid-polling-devices';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AssociationType } from '../../../../services/custom-oids/enums/association-type.enum';

@UntilDestroy()
@Component({
  selector: 'nx-custom-oid-polling-devices-container',
  template: `
    <nx-loading
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [showContent]="true"
      [contentTemplate]="contentTemplate">
      <ng-template #contentTemplate>
        <nx-custom-oid-polling-devices
          [data]="data$ | async"
          [selectedIds]="selectedIds$ | async"
          [statusBarData]="statusBarData$ | async"
          [isAllDevicesSelected]="isAllDevicesSelected"
          [isNoteHidden]="isNoteHidden"
          (rowIdsSelected)="rowIdsSelected($event)"
          (allDevicesSelected)="allDevicesSelected($event)"
          (columnFilterChanged)="columnFilterChanged($event)"
          (globalSearchTermChanged)="globalSearchTermChanged($event)"
          (columnSortChanged)="columnSortChanged($event)">
        </nx-custom-oid-polling-devices>
      </ng-template>
    </nx-loading>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomOidPollingDevicesContainer),
      multi: true
    }
  ]
})
export class CustomOidPollingDevicesContainer implements ControlValueAccessor, OnDestroy {

  @Input() isNoteHidden = false;

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  data$: Observable<CustomOidPollingDevices[]>;
  selectedIds$: Observable<string[]>;
  statusBarData$: Observable<GridStatusBar>;

  isAllDevicesSelected: boolean;

  _onChange: (_: { associationType: AssociationType, deviceSerials: string[] }) => void = () => void 0;

  constructor(
    private customOidPollingDevices: CustomOidPollingDevicesService,
  ) {
    this.isLoading$ = this.customOidPollingDevices.selectLoading();
    this.error$ = this.customOidPollingDevices.selectError();
    this.data$ = this.customOidPollingDevices.selectFilteredGroups();
    this.statusBarData$ = this.customOidPollingDevices.selectStatusBarData();
    this.selectedIds$ = this.customOidPollingDevices.selectFilteredActiveRows();

    this.customOidPollingDevices.selectAllActiveId()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(deviceIds => {
        this._onChange({
          associationType: AssociationType.SPECIFIC_DEVICES,
          deviceSerials: deviceIds
        });
      });
  }

  ngOnDestroy() {
    this.customOidPollingDevices.resetFilters();
  }

  columnFilterChanged(filterChange: FilterChange[]): void {
    filterChange.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.customOidPollingDevices.setFilter(filter.field, filter.term);
      }
    });
  }

  globalSearchTermChanged(searchTerm: string): void {
    this.customOidPollingDevices.setGlobalFilter(searchTerm);
  }

  columnSortChanged(change: GridColumnSort): void {
    if (change === void 0) {
      this.customOidPollingDevices.clearSort();
    } else {
      this.customOidPollingDevices.setSortBy(change.colId, change.sort, change.customSortFn);
    }
  }

  rowIdsSelected(event) {
    this.customOidPollingDevices.setActiveRows(event);
  }

  allDevicesSelected(event: boolean): void {
    const associationType = event ? AssociationType.ALL_DEVICES : AssociationType.SPECIFIC_DEVICES;
    const deviceSerials = event ? [] : this.customOidPollingDevices.getSelectedActiveIds();

    this._onChange({ associationType, deviceSerials });
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: { associationType: AssociationType, deviceSerials: string[] }): void {
    if (obj != null) {
      this.isAllDevicesSelected = obj.associationType === AssociationType.ALL_DEVICES;
      this.customOidPollingDevices.setActiveRows(obj.deviceSerials);
    }
  }
}
