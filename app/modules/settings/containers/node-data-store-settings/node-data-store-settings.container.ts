import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {DataManagementService} from '../../services/data-management/data-management.service';
import {filter, map} from 'rxjs/operators';
import {NodeDataStoreSettings} from '../../components/node-data-store-settings/node-data-store-settings.interface';
import {NodeDataInfo} from '../../components/node-data-info-list/node-data-info.model';
import {NodeTaskRequest} from '../../components/node-data-store-settings/node-task-request';

@Component({
  selector: 'nx-node-data-store-settings-container',
  template: `
    <nx-node-data-store-settings
      [isLoading]="isLoading"
      [taskLoading]="taskLoading$ | async"
      [settings]="nodeData$ | async"
      (applySettings)="applySettings.emit($event)"
      (taskRequest)="runTask.emit($event)"
    >
    </nx-node-data-store-settings>
  `,
  styles: [`
    :host {
      height: 100%;
      overflow-y: hidden;
      width: 50%;
      position: relative;
    }
  `]
})
export class NodeDataStoreSettingsContainer {

  @Input() isLoading: boolean;
  @Output() runTask = new EventEmitter<NodeTaskRequest>();
  @Output() applySettings = new EventEmitter<NodeDataStoreSettings>();

  nodeData$: Observable<NodeDataStoreSettings>;
  taskLoading$: Observable<boolean>;

  constructor(
    private dataManagement: DataManagementService
  ) {
    this.nodeData$ = this.dataManagement.selectActiveNode()
      .pipe(
        filter(node => node !== void 0),
        map(node => {
          return {
            node: new NodeDataInfo({
              id: node.nodeId,
              name: node.nodeName,
              freeSpace: node.volumeFree,
              totalSpace: node.volumeSize,
              useDefaultSettings: node.useAllNodesConfig,
              nodeState: node.nodeState,
              nodesData: node.dataManagementConfigRecords
            }),
            dataStoreSettings: node.dataManagementConfigRecords
          };
        })
      );

    this.taskLoading$ = this.dataManagement.selectTasksStatus();
  }

}
