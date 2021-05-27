import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {GridFilterable} from '../../../services/grid-string-filter/grid-filterable';
import {StringFilterable} from '../../../../../utils/dataUtils/string-filterable';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-table-string-filter',
  templateUrl: './table-string-filter.component.html',
  styleUrls: ['./table-string-filter.component.less']
})
export class TableStringFilterComponent implements OnInit, OnDestroy {

  @Input() searchTerm: string;
  @Input() debounceTimeValue = 200;
  @Input() isDisabled = false;

  @Output() searchTermChange = new EventEmitter<string>();

  private debouncer: Subject<string> = new Subject<string>();

  constructor() {
    this.debouncer
      .pipe(
        untilDestroyed(this),
        debounceTime(this.debounceTimeValue)
      )
      .subscribe((value) => this.searchTermChange.emit(value));
  }

  ngOnInit() {
  }

  handleSearchModelChange(term: string) {
    this.debouncer.next(term);
  }

  ngOnDestroy(): void {
    this.debouncer.complete();
  }

}
