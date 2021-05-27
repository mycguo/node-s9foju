import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { PreConfiguredOidPollingModel } from '../../services/pre-configured-oid-polling/models/pre-configured-oid-polling-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DisplayError } from '../../../shared/components/loading/enums/display-error.enum';
import { Observable } from 'rxjs';
import DetailedError from '../../../shared/components/loading/detailed-error';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { PreConfiguredOidPollingService } from '../../services/pre-configured-oid-polling/pre-configured-oid-polling.service';
import { PreConfiguredOidPollingSettings } from '../../services/pre-configured-oid-polling/models/pre-configured-oid-polling-settings';
import { NotificationLabelStatus } from '../../../shared/components/notification-label/enums/notification-label-status.enum';
import { PreConfiguredOidMetaData } from '../../services/pre-configured-oid-polling/models/pre-configured-oid-meta-data';
import { AssociationType } from '../../../../services/custom-oids/enums/association-type.enum';

@UntilDestroy()
@Component({
  selector: 'nx-pre-configured-oid-polling-modal',
  templateUrl: './pre-configured-oid-polling-modal.component.html',
  styleUrls: ['./pre-configured-oid-polling-modal.component.less']
})
export class PreConfiguredOidPollingModalComponent
  extends DialogComponent<PreConfiguredOidPollingModel, PreConfiguredOidPollingModel>
  implements OnInit, OnDestroy {

  // Form Elements
  formGroup: FormGroup;
  devicesControlKey = 'devices';
  status = NotificationLabelStatus.INFO;

  currentOids: string;

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  DISPLAY_ERROR: typeof DisplayError = DisplayError;
  alertMessageOverride: SimpleAlert = new SimpleAlert('Error', void 0);

  private static getOidsString(oids: PreConfiguredOidMetaData[]): string {
    return oids?.map(({ displayName, oid }) => `${displayName}`).join(', ');
  }

  constructor(
    private preConfiguredOidPollingService: PreConfiguredOidPollingService,
    public dialogRef: MatDialogRef<DialogComponent<PreConfiguredOidPollingModel, PreConfiguredOidPollingModel>>,
    @Inject(MAT_DIALOG_DATA) public data: PreConfiguredOidPollingModel,
  ) {
    super(null, dialogRef);

    this.isLoading$ = this.preConfiguredOidPollingService.selectLoading();
    this.error$ = this.preConfiguredOidPollingService.selectError();
    this.currentOids = this.data.metaData ? PreConfiguredOidPollingModalComponent.getOidsString(this.data.metaData.oids) : '';
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      [this.devicesControlKey]:
        new FormControl(
          {
            associationType: this.data?.settings?.associationType,
            deviceSerials: this.data?.settings?.association?.deviceSerials || [],
          },
        )
    });
  }

  ngOnDestroy(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const { associationType, deviceSerials } = this.formGroup.get(this.devicesControlKey).value;

    const settings: PreConfiguredOidPollingSettings =  {
      ...this.data.settings,
      associationType,
      association: {
        deviceSerials,
      }
    };
    this.preConfiguredOidPollingService.updatePreConfiguredOidPolling(this.data.id, settings)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe(resp => this.dialogRef.close(resp));
  }
}
