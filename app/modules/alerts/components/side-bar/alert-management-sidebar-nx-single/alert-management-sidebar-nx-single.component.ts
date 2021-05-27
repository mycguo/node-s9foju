import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import NxAlertManagement from '../../../services/nx-alert-management/models/nx-alert-management';
import {CommonService} from '../../../../../utils/common/common.service';
import {ToggleModel} from '../../../../shared/components/form/toggle/models/toggle.model';
import {SelectInput} from '../../../../shared/components/form/select/models/select-input';
import {SimpleInputModel} from '../../../../shared/components/form/simple-input/models/simple-input.model';
import {SelectOption} from '../../../../shared/components/form/select/models/select-option';
import {AlertSeverity} from '../../../services/enums/alert-severity.enum';
import HtmlInputTypesEnum from '../../../../shared/components/form/simple-input/models/html-input-types.enum';
import {FormValidationService} from '../../../../../services/form-validation/form-validation.service';
import { ENABLED_KEY } from '../thresholds/threshold-keys';
import { BASE_INTEGERS } from '../../../../../constants/base-integers.enum';
import NxAlertManagementConfig from '../../../services/nx-alert-management/models/nx-alert-management-config';
import NxAlertManagementConfigThreshold from '../../../services/nx-alert-management/models/nx-alert-management-config-threshold';

const SEVERITY_KEY = 'severity';
const COOL_DOWN_MINUTES_KEY = 'coolDownMinutes';
const CONFIG_KEY = 'config';
const SHARING_KEY = 'couriers';

@Component({
  selector: 'nx-alert-management-sidebar-nx-single',
  templateUrl: './alert-management-sidebar-nx-single.component.html',
  styleUrls: ['./alert-management-sidebar-nx-single.component.less']
})
export class AlertManagementSidebarNxSingleComponent implements OnInit, OnChanges {
  @Input() alert: NxAlertManagement;
  @Input() isLoading: boolean;
  @Output() cancel = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<NxAlertManagement>();

  MULTIPLE = AlertSeverity.MULTIPLE;
  enableField: ToggleModel;
  severityField: SelectInput;
  coolDownMinutesField: SimpleInputModel;

  hideSeverity: boolean;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private commonService: CommonService,
              private formValidationService: FormValidationService) {
    this.formGroup = this.fb.group({
      [this.staticEnabledKey]: this.fb.control(false),
      [this.staticSeverityKey]: this.fb.control(void 0),
      [this.staticCoolDownMinutesKey]: this.fb.control(0),
      [this.staticConfigKey]: this.fb.control({}),
      [this.staticSharingKey]: this.fb.control({})
    });

    this.enableField = new ToggleModel('On', 'Off', 'Enabled');
    this.severityField = new SelectInput([
      new SelectOption(AlertSeverity.CRITICAL, this.commonService.startCase(AlertSeverity.CRITICAL.toLowerCase())),
      new SelectOption(AlertSeverity.WARNING, this.commonService.startCase(AlertSeverity.WARNING.toLowerCase())),
      new SelectOption(AlertSeverity.INFO, this.commonService.startCase(AlertSeverity.INFO.toLowerCase())),
    ], 'Severity');
    this.coolDownMinutesField = new SimpleInputModel(HtmlInputTypesEnum.number,
      'Automatic Resolution Time',
      void 0,
      void 0,
      'min');
  }

  get staticEnabledKey(): string {
    return ENABLED_KEY;
  }

  get staticSeverityKey(): string {
    return SEVERITY_KEY;
  }

  get staticCoolDownMinutesKey(): string {
    return COOL_DOWN_MINUTES_KEY;
  }

  get staticConfigKey(): string {
    return CONFIG_KEY;
  }

  get staticSharingKey(): string {
    return SHARING_KEY;
  }

  ngOnInit(): void {
    this.setForm(this.alert);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.alert?.currentValue)) {
      const alert: NxAlertManagement = changes.alert.currentValue;
      this.setForm(alert);
    }
    if (!this.commonService.isNil(changes?.isLoading?.currentValue)) {
      changes.isLoading.currentValue ?
        this.formGroup.disable({onlySelf: true, emitEvent: false}) :
        this.formGroup.enable({onlySelf: true, emitEvent: false});
    }
  }

  setForm(alert: NxAlertManagement): void {
    if (alert.coolDownMinutes == null) {
      this.formGroup.get(this.staticCoolDownMinutesKey).setValidators([]);
    } else {
      this.formGroup.get(this.staticCoolDownMinutesKey).setValidators([
        Validators.required,
        this.formValidationService.number(),
        Validators.min(0),
        Validators.max(BASE_INTEGERS.MAX_JAVA_INTEGER),
        this.formValidationService.wholeNumber()
      ]);
    }
    if (alert.severity == null) {
      this.formGroup.get(this.staticSeverityKey).setValidators([]);
    } else {
      this.formGroup.get(this.staticSeverityKey).setValidators([Validators.required]);
    }
    this.formGroup.patchValue({
      [this.staticEnabledKey]: alert.enabled,
      [this.staticSeverityKey]: alert.severity,
      [this.staticCoolDownMinutesKey]: alert.coolDownMinutes,
      [this.staticConfigKey]: alert.config,
      [this.staticSharingKey]: alert.sharing
    });
  }

  submit(): void {

    this.submitForm.emit(
      new NxAlertManagement({
        ...this.alert,
        enabled: this.formGroup.get(this.staticEnabledKey).value,
        severity: this.formGroup.get(this.staticSeverityKey).value,
        coolDownMinutes: this.formGroup.get(this.staticCoolDownMinutesKey).value,
        config: this.getConfigFromForm(this.formGroup),
        sharing: this.formGroup.get(this.staticSharingKey).value
      })
    );
  }

  /**
   * Return a config with the updated threshold severity based on a formGroup
   * @param formGroup the form group for the entire alert side bar (includes config section)
   */
  private getConfigFromForm(formGroup: FormGroup): NxAlertManagementConfig {
    const configFormValue = formGroup.get(this.staticConfigKey).value;
    return {
      ...configFormValue,
      thresholds: configFormValue.thresholds.map((threshold: NxAlertManagementConfigThreshold) => {
        return {
          ...threshold,
          // ensure severity of threshold matches (works b/c single nx alert has only one severity)
          severity: formGroup.get(this.staticSeverityKey).value
        };
      })
    };
  }
}
