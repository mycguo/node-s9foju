import {Component, OnDestroy, OnInit} from '@angular/core';
import {GridColumnFilter} from '../grid-column-filter';
import FilterChange from '../filter-change';
import {GridColumnFilterParams} from '../../../models/grid-column-filter-params';
import {SelectFilterParams} from './select-filter-params';
import {BehaviorSubject, Observable} from 'rxjs';
import {SelectInput} from '../../../../shared/components/form/select/models/select-input';
import {SelectOption} from '../../../../shared/components/form/select/models/select-option';
import {CommonService} from '../../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.less']
})
export class SelectFilterComponent implements OnInit, OnDestroy,
  GridColumnFilter<FilterChange, GridColumnFilterParams<FilterChange, SelectFilterParams>> {

  static readonly ALL_OPTION: SelectOption = new SelectOption(-1, 'All');

  private _filterChangedSubject = new BehaviorSubject<FilterChange>({field: void 0, term: ''});

  filterChanged$: Observable<FilterChange> = this._filterChangedSubject.asObservable();

  field: string;
  model: string | number | boolean = -1;
  selectModel = new SelectInput([SelectFilterComponent.ALL_OPTION]);

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this._filterChangedSubject.complete();
  }

  onFilterInit(columnFilterParams: GridColumnFilterParams<FilterChange, SelectFilterParams>): void {
    this.field = columnFilterParams.field;
    this.selectModel.options = this.buildOptions(columnFilterParams.componentParams.options);
    if (!this.commonService.isNil(columnFilterParams.componentParams.filterValue)) {
      this.model = columnFilterParams.componentParams.filterValue;
    }
    if (columnFilterParams.onChange !== void 0) {
      columnFilterParams.onChange
        .pipe(untilDestroyed(this))
        .subscribe((filterParamChange: SelectFilterParams) => {
          if (!this.commonService.isNil(filterParamChange?.options)) {
            this.selectModel.options = this.buildOptions(filterParamChange.options);
          }

          if (!this.commonService.isNil(filterParamChange?.filterValue)) {
            this.model = filterParamChange.filterValue;
          }
        });
    }
  }

  onFilterChange(selected: string | number): void {
    if (!this.commonService.isNil(selected)) {
      if (selected === -1) {
        selected = void 0;
      }
      this._filterChangedSubject.next({field: this.field, term: <string>selected});
    }
  }

  buildOptions(options: Array<SelectOption>) {
    return [SelectFilterComponent.ALL_OPTION, ...options];
  }
}
