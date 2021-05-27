import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DialogComponent} from '../../../shared/components/dialog/dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {take} from 'rxjs/operators';
import {DataManagementService} from '../../services/data-management/data-management.service';
import {TaskTypes} from '../../services/data-management/enums/task-types.enum';
import {DataManagementTaskRequest} from '../../services/data-management/interfaces/data-management-task-request';
import {TaskAction} from '../../services/data-management/enums/task-action.enum';
import {NodeTaskRequest} from '../node-data-store-settings/node-task-request';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import {HttpErrorResponse} from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'nx-data-store-backup-modal',
  templateUrl: './data-store-backup-modal.component.html',
  styleUrls: ['./data-store-backup-modal.component.less']
})
export class DataStoreBackupModalComponent extends DialogComponent<NodeTaskRequest, string>
implements OnInit, OnDestroy {

  formControl: FormControl;
  inputModel: SimpleInputModel;
  taskAlert: SimpleAlert;
  isLoading: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent<NodeTaskRequest, string>>,
    @Inject(MAT_DIALOG_DATA) public data: NodeTaskRequest,
    private dataManagement: DataManagementService
  ) {
    super(data, dialogRef);
  }

  ngOnInit() {
    this.formControl = new FormControl(null, Validators.required);
    this.inputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Directory',
      'Type directory name'
    );
  }

  ngOnDestroy() {
  }

  cancel(): void {
    // prevent closing modal while sending request
    if (this.isLoading) {
      return;
    }
    this.dialogRef.close();
  }

  runBackup(): void {
    this.isLoading = true;
    const taskRequest: DataManagementTaskRequest = {
      action: TaskAction.START,
      backupDirectoryPath: this.formControl.value,
      dataStoreType: this.data.dataStoreType,
      nodeIds: [this.data.nodeId]
    };
    this.dataManagement.runTask(TaskTypes.BACKUP, taskRequest)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe((response: string) => {
        this.dialogRef.close(response);
        }, ((errorResponse: HttpErrorResponse) => {
          this.isLoading = false;
          this.taskAlert = new SimpleAlert(
            'Error:',
            errorResponse.error?.message || 'Error starting backup task'
          );
        })
      );
  }

}
