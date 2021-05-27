import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {SelectInput} from '../../../shared/components/form/select/models/select-input';
import {FormControl, FormGroup} from '@angular/forms';
import {LiveInsightEdgeReportChartObject} from '../../services/live-insight-edge-report-page/reports-services/live-insight-edge-report-chart-object';
import SortOrder from '../../services/live-insight-edge-report-page/sort-order';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';

@UntilDestroy()
@Component({
  selector: 'nx-live-insight-edge-reports-list',
  templateUrl: './live-insight-edge-reports-list.component.html',
  styleUrls: ['./live-insight-edge-reports-list.component.less']
})
export class LiveInsightEdgeReportsListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() reports: Array<LiveInsightEdgeReportChartObject>;
  @Input() dateSort: SortOrder = SortOrder.DESCENDING;
  @Input() anomalyCountSort: SortOrder = SortOrder.DESCENDING;
  @Input() isLoading = true;
  @Input() errorMessage: string;

  @Output() dateSortChange = new EventEmitter<SortOrder>();
  @Output() anomalyCountSortChange = new EventEmitter<SortOrder>();

  noDataObj = new LaNoDataMessage('No data available at the moment',
    'Please wait for data to become available...',
    'la-no-data-message__icon-no-data');

  dateSortModel = new SelectInput(
    [
      new SelectOption(SortOrder.DESCENDING, 'Recent first'),
      new SelectOption(SortOrder.ASCENDING, 'Oldest first'),
    ]
  );

  anomalyCountSortModel = new SelectInput(
    [
      new SelectOption(SortOrder.DESCENDING, 'High to Low'),
      new SelectOption(SortOrder.ASCENDING, 'Low to High'),
    ]
  );

  dateSortFormControl = new FormControl();
  anomalyCountSortControl = new FormControl();

  sortFormGroup = new FormGroup({
    dateSort: this.dateSortFormControl,
    anomalyCountSort: this.anomalyCountSortControl
  });


  detailedError: DetailedError;

  constructor() { }

  ngOnInit(): void {
    // these should idealy be set by an existing state external to component
    this.dateSortFormControl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((sortOrder) => {
      this.dateSortChange.emit(sortOrder);
    });

    this.anomalyCountSortControl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((sortOrder) => {
      this.anomalyCountSortChange.emit(sortOrder);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dateSort?.currentValue !== changes.dateSort?.previousValue) {
      this.dateSortFormControl.setValue(this.dateSort);
    }
    if (changes.anomalyCountSort?.currentValue !== changes.anomalyCountSort?.previousValue) {
      this.anomalyCountSortControl.setValue(this.anomalyCountSort);
    }
    if (changes.isLoading?.currentValue !== changes.isLoading?.previousValue) {
      if (this.isLoading && this.errorMessage == null) {
        this.dateSortFormControl.disable({ emitEvent: false, onlySelf: true });
        this.anomalyCountSortControl.disable({ emitEvent: false, onlySelf: true });
      } else {
        this.dateSortFormControl.enable({ emitEvent: false, onlySelf: true });
        this.anomalyCountSortControl.enable({ emitEvent: false, onlySelf: true });
      }
    }
    if (changes.errorMessage?.currentValue !== changes.errorMessage?.previousValue) {
      if (this.errorMessage != null) {
        this.detailedError = new DetailedError('', this.errorMessage);
      } else {
        this.detailedError = null;
      }
    }
  }

  ngOnDestroy(): void {
  }



}
