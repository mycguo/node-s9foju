import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AlertSharingConfig} from '../sharing/alert-sharing-config';
import {SdwanAlertManagement} from '../../../services/sdwan-alert-management/sdwan-alert-management';
import {ToggleModel} from '../../../../shared/components/form/toggle/models/toggle.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../../utils/common/common.service';
import {SelectInput} from '../../../../shared/components/form/select/models/select-input';

const ENABLED_KEY = 'enabled';
const SHARING_KEY = 'couriers';

@Component({
  selector: 'nx-alert-management-sidebar-sdwan',
  templateUrl: './alert-management-sidebar-sdwan.component.html',
  styleUrls: ['./alert-management-sidebar-sdwan.component.less']
})
export class AlertManagementSidebarSdwanComponent implements OnInit, OnChanges {
  @Input() alert: SdwanAlertManagement;
  @Input() isLoading: boolean;
  @Output() cancel = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<SdwanAlertManagement>();

  enableField: ToggleModel;
  severityField: SelectInput;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private commonService: CommonService) {
    this.formGroup = this.fb.group({
      [this.staticEnabledKey]: this.fb.control(false),
      [this.staticSharingKey]: this.fb.control({})
    });
    this.enableField = new ToggleModel('On', 'Off', 'Enabled');
    this.severityField = new SelectInput([], 'Severity', 'Set by vManage');
  }

  get staticEnabledKey(): string {
    return ENABLED_KEY;
  }

  get staticSharingKey(): string {
    return SHARING_KEY;
  }

  ngOnInit(): void {
    this.setForm(this.alert);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.alert?.currentValue)) {
      const alert: SdwanAlertManagement = changes.alert.currentValue;
      this.setForm(alert);
    }
    if (!this.commonService.isNil(changes?.isLoading?.currentValue)) {
      changes.isLoading.currentValue ?
        this.formGroup.disable({onlySelf: true, emitEvent: false}) :
        this.formGroup.enable({onlySelf: true, emitEvent: false});
    }
  }

  setForm(alert: SdwanAlertManagement): void {
    this.formGroup.patchValue({
      [this.staticEnabledKey]: alert.enabled,
      [this.staticSharingKey]: alert.sharing
    });
  }

  submit(): void {
    this.submitForm.emit(
      new SdwanAlertManagement({
        ...this.alert,
        enabled: this.formGroup.get(this.staticEnabledKey).value,
        sharing: this.formGroup.get(this.staticSharingKey).value
      })
    );
  }
}
