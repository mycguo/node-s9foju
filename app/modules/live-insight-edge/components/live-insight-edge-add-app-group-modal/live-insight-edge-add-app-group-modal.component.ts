import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import {ModalSize} from '../../../shared/components/modal-container/modal-size.enum';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import {AnalyticsPlatformMonitoredAppGroup} from '../../../../services/analytics-platform/monitored-app-group/analytics-platform-monitored-app-group';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-live-insight-edge-add-app-group-modal',
  templateUrl: './live-insight-edge-add-app-group-modal.component.html',
  styleUrls: ['./live-insight-edge-add-app-group-modal.component.less']
})
export class LiveInsightEdgeAddAppGroupModalComponent implements OnInit, OnChanges {
  @Input() appGroups: GridData<AnalyticsPlatformMonitoredAppGroup> =
    <GridData<AnalyticsPlatformMonitoredAppGroup>>{rows: []};
  @Input() addButtonActive = false;
  @Input() errorMessage: string;
  @Input() requestError: SimpleAlert;
  @Input() isLoading = true;
  @Input() selectedAppGroupIds: Array<string>;
  @Input() statusBarData: GridStatusBar;

  @Output() cancelModal = new EventEmitter();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() appGroupsSelected = new EventEmitter<Array<string>>();
  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>();
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>();
  @Output() addSelectedAppGroups = new EventEmitter();

  ModalSize = ModalSize;
  error: DetailedError;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.errorMessage?.currentValue != null) {
      this.error = Object.assign(new Error(changes.errorMessage.currentValue), {title: void 0});
    }

    if (changes?.requestError?.currentValue != null) {
      this.error = new DetailedError(this.requestError.title, this.requestError.message);
    }
  }

}
