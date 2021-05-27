import {ChangeDetectorRef, Component, OnInit, Self} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NgControl, ValidationErrors, Validator, ValidatorFn,
  Validators
} from '@angular/forms';
import NxAlertManagementConfig from '../../../../services/nx-alert-management/models/nx-alert-management-config';
import {CommonService} from '../../../../../../utils/common/common.service';
import {FormValidationService} from '../../../../../../services/form-validation/form-validation.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {map} from 'rxjs/operators';
import NxAlertManagementConfigThreshold from '../../../../services/nx-alert-management/models/nx-alert-management-config-threshold';
import {AlertManagementSidebarThresholdConfigFormComponent} from '../alert-management-sidebar-threshold-config-form/alert-management-sidebar-threshold-config-form.component';
import {SimpleInputModel} from '../../../../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../../../../shared/components/form/simple-input/models/html-input-types.enum';
import {TimeOverMinutesInputModel, TIME_OVER_MINUTES_KEY} from '../../../../constants/time-over-minutes.constants';
import {ENABLED_KEY} from '../threshold-keys';
import { BASE_INTEGERS } from '../../../../../../constants/base-integers.enum';

const LABEL_KEY = 'label';
const DROP_RATE_KEY = 'value';

interface QosFormGroup {
  [ENABLED_KEY]: boolean;
  [LABEL_KEY]: string;
  [DROP_RATE_KEY]: string;
  [TIME_OVER_MINUTES_KEY]: number;
}

interface ThresholdField {
  [LABEL_KEY]: SimpleInputModel;
  [DROP_RATE_KEY]: SimpleInputModel;
  [TIME_OVER_MINUTES_KEY]: SimpleInputModel;
}

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-sidebar-threshold-qos',
  templateUrl: './alert-management-sidebar-threshold-qos.component.html',
  styleUrls: ['./alert-management-sidebar-threshold-qos.component.less']
})
export class AlertManagementSidebarThresholdQosComponent implements OnInit, ControlValueAccessor, Validator {
  config: NxAlertManagementConfig;

  thresholdsArray: FormArray;
  thresholdFields: Array<ThresholdField> = [];

  onTouched: () => void;

  errorMessageOverrides: { [p: string]: (args: any) => string };

  constructor(@Self() public controlDir: NgControl,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder,
              private commonService: CommonService,
              private formValidationService: FormValidationService
  ) {
    controlDir.valueAccessor = this;
    this.errorMessageOverrides = {
      oneThreshold: () => 'At least one threshold must be enabled'
    };
    this.thresholdsArray = this.fb.array([], [this.qosValidation()]);
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  get staticEnabledKey(): string {
    return ENABLED_KEY;
  }

  get staticLabelKey(): string {
    return LABEL_KEY;
  }

  get staticDropRateKey(): string {
    return DROP_RATE_KEY;
  }

  get staticTimeOverMinutesKey(): string {
    return TIME_OVER_MINUTES_KEY;
  }

  ngOnInit() {
    // explicitly ignoring validators on control
    this.control.setValidators(this.validate.bind(this));
  }

  writeValue(config: NxAlertManagementConfig): void {
    if (!this.commonService.isNil(config)) {
      this.config = config;

      let thresholds: Array<NxAlertManagementConfigThreshold> = this.commonService.cloneDeep(config.thresholds);
      // LD-28561 should resolve moving timeOverMinutes around
      if (config.timeOverMinutes != null) {
        thresholds = thresholds.map((threshold) => {
          return {
            ...threshold,
            timeOverMinutes: config.timeOverMinutes
          };
        });
      }
      // ensure first item in array is default (b/c label is null)
      thresholds.sort((a: NxAlertManagementConfigThreshold, b: NxAlertManagementConfigThreshold) => {
        if (a.label == null) {
          return -1;
        } else if (b.label == null) {
          return 1;
        }
        return 0;
      });
      this.thresholdFields = []; // reset
      this.thresholdsArray.reset();
      thresholds.forEach((t: NxAlertManagementConfigThreshold) => {
        this.thresholdsArray.push(this.buildFormControl(t.enabled, t.label, t.value, t.timeOverMinutes, t.label == null));
      });
      // needed to update validation of form array
      // https://stackoverflow.com/a/64115889/6750072
      this.cd.detectChanges();
    }
  }

  registerOnChange(fn: (val: NxAlertManagementConfig) => void): void {
    this.thresholdsArray.valueChanges
      .pipe(
        untilDestroyed(this),
        map((formArray: Array<QosFormGroup>): NxAlertManagementConfig => {
          return {
            ...this.config,
            thresholds: formArray.map((threshold: QosFormGroup, index: number) => {
              return {
                severity: null,
                enabled: formArray[index][this.staticEnabledKey],
                label: formArray[index][this.staticLabelKey],
                value: formArray[index][this.staticDropRateKey],
                timeOverMinutes: formArray[index][this.staticTimeOverMinutesKey]
              } as NxAlertManagementConfigThreshold;
            })
          };
        }))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.thresholdsArray.disable({emitEvent: false, onlySelf: true}) :
      this.thresholdsArray.enable({emitEvent: false, onlySelf: true});
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.thresholdsArray.valid ? null : {singleThreshold: {valid: false}};
  }

  getFormGroup(ctrl: AbstractControl): FormGroup {
    return ctrl as FormGroup;
  }

  addThreshold(): void {
    this.onTouched();
    this.thresholdsArray.push(this.buildFormControl(true, '', 0, 0));
  }

  deleteThreshold(index: number) {
    if (index !== 0) {
      this.onTouched();
      this.thresholdFields.splice(index, 1);
      this.thresholdsArray.removeAt(index);
    }
  }

  private buildFormControl(enabled: boolean, label: string, value: number, timeOverMinutes: number, isDefault = false): FormGroup {
    this.thresholdFields.push({
      [LABEL_KEY]: new SimpleInputModel(
        HtmlInputTypesEnum.text,
        isDefault ? 'Catch All Threshold' : 'Qos Class',
        isDefault ? 'All non-specified QoS Classes' : '',
      ),
      [DROP_RATE_KEY]: new SimpleInputModel(
        HtmlInputTypesEnum.number,
        'Drop rate',
        '0',
        void 0,
        'kbps'
      ),
      [TIME_OVER_MINUTES_KEY]: TimeOverMinutesInputModel
    });
    const labelValidators = [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(BASE_INTEGERS.MAX_JAVA_INTEGER)
    ];
    return this.fb.group({
      [this.staticEnabledKey]: this.fb.control(enabled),
      [this.staticLabelKey]: this.fb.control({value: label, disabled: isDefault},
        isDefault ? [] : labelValidators),
      [this.staticDropRateKey]: this.fb.control(value, [
        Validators.required,
        this.formValidationService.number(),
        Validators.min(0),
        Validators.max(BASE_INTEGERS.MAX_JAVA_INTEGER),
        this.formValidationService.wholeNumber()
      ]),
      [this.staticTimeOverMinutesKey]: this.fb.control(timeOverMinutes, [
        Validators.required,
        this.formValidationService.number(),
        Validators.min(0),
        Validators.max(BASE_INTEGERS.MAX_JAVA_INTEGER),
        this.formValidationService.wholeNumber()
      ])
    });
  }

  private qosValidation(): ValidatorFn {
    return (control: FormArray): ValidationErrors | null => {
      if (control?.value != null &&
        control.value.some((group: QosFormGroup) => group[ENABLED_KEY])) {
        return null;
      }

      return {
        oneThreshold: false
      };
    };
  }
}
