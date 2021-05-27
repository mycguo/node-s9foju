import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Tab } from '../../../shared/components/tabset/tab';
import { CustomOidPollingModalTabIds } from './enums/custom-oid-polling-modal-tab-ids.enum';
import { CustomOid } from '../../../../services/custom-oids/models/custom-oid';
import { CustomOidPollingService } from '../../services/custom-oid-polling/custom-oid-polling.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AssociationType } from '../../../../services/custom-oids/enums/association-type.enum';
import { DisplayError } from '../../../shared/components/loading/enums/display-error.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';

@UntilDestroy()
@Component({
  selector: 'nx-custom-oid-polling-modal',
  templateUrl: './custom-oid-polling-modal.component.html',
  styleUrls: ['./custom-oid-polling-modal.component.less']
})
export class CustomOidPollingModalComponent extends DialogComponent<CustomOid, CustomOid> implements OnInit, OnDestroy, AfterViewInit {

  // Form Elements
  formGroup: FormGroup;
  generalControlKey = 'general';
  devicesControlKey = 'devices';

  tabs: Array<Tab>;
  tabIds = CustomOidPollingModalTabIds;
  selectedTabId: string = CustomOidPollingModalTabIds.GENERAL;
  @ViewChild('devicesTabLabelTpl') devicesTabLabelTpl: TemplateRef<any>;

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  DISPLAY_ERROR: typeof DisplayError = DisplayError;
  alertMessageOverride: SimpleAlert = new SimpleAlert('Error', void 0);

  devicesTabCount: string;

  private static selectedDevicesValidation(control: AbstractControl): ValidationErrors | null {
    if (control.value?.associationType === AssociationType.ALL_DEVICES) {
      return null;
    }
    return control.value?.deviceSerials?.length > 0 ? null : {devices: {valid: false, message: `No devices selected`}};
  }

  private static getDevicesTabCount(obj: { associationType: AssociationType, deviceSerials: string[] }): string {
    if (obj.associationType === AssociationType.ALL_DEVICES) {
      return 'All devices';
    } else {
      return obj.deviceSerials.length.toString();
    }
  }

  constructor(
    private customOidPollingService: CustomOidPollingService,
    public dialogRef: MatDialogRef<DialogComponent<CustomOid, CustomOid>>,
    @Inject(MAT_DIALOG_DATA) public data: CustomOid,
    private cd: ChangeDetectorRef
  ) {
    super(null, dialogRef);

    this.isLoading$ = this.customOidPollingService.selectLoading();
    this.error$ = this.customOidPollingService.selectError();
  }

  ngOnInit(): void {
    this.customOidPollingService.resetError();
    this.formGroup = new FormGroup({
      [this.generalControlKey]: new FormControl(this.data || null),
      [this.devicesControlKey]:
        new FormControl({
          associationType: this.data?.associationType,
          deviceSerials: this.data?.association?.deviceSerials || [],
        }, CustomOidPollingModalComponent.selectedDevicesValidation)
    });
    this.devicesTabCount = CustomOidPollingModalComponent.getDevicesTabCount({
      associationType: this.data?.associationType,
      deviceSerials: this.data?.association?.deviceSerials || []
    });
    this.formGroup.get(this.devicesControlKey).valueChanges.subscribe((obj) => {
        this.devicesTabCount = CustomOidPollingModalComponent.getDevicesTabCount(obj);
    });

    this.tabs = [
      new Tab(
        CustomOidPollingModalTabIds.GENERAL,
        'General'
      ),
      new Tab(
        CustomOidPollingModalTabIds.DEVICES,
        'Devices'
      )
    ];
  }

  ngOnDestroy() {
    // reset devices table selected rows, filters and sort
    this.customOidPollingService.resetDevicesSelection();
    this.customOidPollingService.resetError();
  }

  handleTabSelected(tabId: string): void {
    this.selectedTabId = tabId;
  }

  cancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const { associationType, deviceSerials } = this.formGroup.get(this.devicesControlKey).value;
    const generalTabValue = this.formGroup.get(this.generalControlKey).value;

    const customOidRequest: CustomOid = {
      id: this.data?.id,
      conversionFactor: generalTabValue.conversionFactor,
      conversionType: generalTabValue.conversionType,
      name: generalTabValue.name,
      oidValue: generalTabValue.oidValue,
      processingType: generalTabValue.processingType,
      units: generalTabValue.units,
      associationType,
      association: {
        deviceSerials,
      },
    };

    if (customOidRequest.id === void 0) {
      this.customOidPollingService.addCustomOid(customOidRequest)
        .pipe(
          untilDestroyed(this),
          take(1)
        )
        .subscribe(resp => this.dialogRef.close(resp));
    } else {
      this.customOidPollingService.editCustomOid(customOidRequest)
        .pipe(
          untilDestroyed(this),
          take(1)
        )
        .subscribe(resp => this.dialogRef.close(resp));
    }
  }

  ngAfterViewInit(): void {
    const devicesTab = this.tabs?.find(tab => tab.id === CustomOidPollingModalTabIds.DEVICES);
    if (devicesTab) {
      devicesTab.labelTemplateRef = this.devicesTabLabelTpl;
      this.cd.detectChanges();
    }
  }
}
