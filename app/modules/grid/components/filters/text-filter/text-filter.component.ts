import {Component, OnDestroy, OnInit} from '@angular/core';
import {GridColumnFilter} from '../grid-column-filter';
import {BehaviorSubject, Subject} from 'rxjs';
import FilterChange from '../filter-change';
import {GridColumnFilterParams} from '../../../models/grid-column-filter-params';
import {TextFilterParams} from './text-filter-params';
import {debounceTime} from 'rxjs/operators';
import {CommonService} from '../../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.less']
})
export class TextFilterComponent implements OnInit, OnDestroy,
  GridColumnFilter<FilterChange, GridColumnFilterParams<FilterChange, TextFilterParams>> {

  static DEBOUNCE_TIME = 250;

  filterChanged$ = new BehaviorSubject<FilterChange>({field: void 0, term: ''});
  filterValue = '';
  field: string;
  debouncer = new Subject<string>();
  isDisabled = false;
  placeholder: string;

  constructor(private commonService: CommonService) {
    this.debouncer
      .pipe(
        untilDestroyed(this),
        debounceTime(TextFilterComponent.DEBOUNCE_TIME)
      )
      .subscribe((filterTerm) => this.filterChanged$.next({field: this.field, term: filterTerm}));
  }

  ngOnInit() {
  }


  onFilterInit(columnFilterParams: GridColumnFilterParams<FilterChange, TextFilterParams>) {
    this.field = columnFilterParams.field;
    this.filterValue = columnFilterParams.componentParams.filterValue;
    this.isDisabled = columnFilterParams.componentParams.isDisabled;
    this.placeholder = columnFilterParams.column.getColDef().headerName || '';
    if (columnFilterParams.onChange !== void 0) {
      columnFilterParams.onChange
        .pipe(untilDestroyed(this))
        .subscribe((filterParamChange: TextFilterParams) => {
          if (!this.commonService.isNil(filterParamChange?.isDisabled)) {
            this.isDisabled = filterParamChange.isDisabled;
          }

          if (!this.commonService.isNil(filterParamChange?.filterValue)) {
            this.filterValue = filterParamChange.filterValue;
          }
        });
    }
    return '';
  }

  onFilterChange(filterTerm: string) {
    this.debouncer.next(filterTerm);
  }

  ngOnDestroy(): void {
    this.filterChanged$.complete();
  }

}
