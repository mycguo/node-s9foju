import {ChangeDetectorRef, Component, OnInit, Self} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NgControl, ValidationErrors, Validator,
  Validators
} from '@angular/forms';
import {CommonService} from '../../../../../../utils/common/common.service';
import {FormValidationService} from '../../../../../../services/form-validation/form-validation.service';
import NxAlertManagementConfig from '../../../../services/nx-alert-management/models/nx-alert-management-config';
import NxAlertManagementConfigThreshold from '../../../../services/nx-alert-management/models/nx-alert-management-config-threshold';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {SimpleInputModel} from '../../../../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../../../../shared/components/form/simple-input/models/html-input-types.enum';
import {map} from 'rxjs/operators';
import {AlertManagementSidebarThresholdConfigFormComponent} from '../alert-management-sidebar-threshold-config-form/alert-management-sidebar-threshold-config-form.component';
import {interval, Subscription} from 'rxjs';
import {TIME_OVER_MINUTES_KEY, TimeOverMinutesInputModel} from '../../../../constants/time-over-minutes.constants';
import {THRESHOLDS_KEY} from '../threshold-keys';
import { BASE_INTEGERS } from '../../../../../../constants/base-integers.enum';

interface ThresholdFormGroup {
  [THRESHOLDS_KEY]: number;
  [TIME_OVER_MINUTES_KEY]: number;
}

interface ThresholdField {
  [THRESHOLDS_KEY]: SimpleInputModel;
  [TIME_OVER_MINUTES_KEY]: SimpleInputModel;
}

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-sidebar-threshold-multiple',
  templateUrl: './alert-management-sidebar-threshold-multiple.component.html',
  styleUrls: ['./alert-management-sidebar-threshold-multiple.component.less']
})
export class AlertManagementSidebarThresholdMultipleComponent implements OnInit, ControlValueAccessor, Validator {
  config: NxAlertManagementConfig;

  thresholdsArray: FormArray;
  thresholdFields: Array<ThresholdField>;

  onTouched: () => void;

  constructor(@Self() public controlDir: NgControl,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder,
              private commonService: CommonService,
              private formValidationService: FormValidationService
  ) {
    controlDir.valueAccessor = this;
    this.thresholdsArray = this.fb.array([]);
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  get staticThresholdKey(): string {
    return THRESHOLDS_KEY;
  }

  get staticTimeOverMinutesKey(): string {
    return TIME_OVER_MINUTES_KEY;
  }

  ngOnInit() {
    const validators = this.control.validator ? [this.control.validator, this.validate.bind(this)] : this.validate.bind(this);
    this.control.setValidators(validators);
  }

  writeValue(config: NxAlertManagementConfig): void {
    if (!this.commonService.isNil(config)) {
      this.config = config;
      this.thresholdFields = []; // reset
      this.thresholdsArray.reset();
      config.thresholds.forEach((t: NxAlertManagementConfigThreshold) => {
        this.thresholdsArray.push(this.buildFormGroup(t));
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
        map((formArray: Array<ThresholdFormGroup>): NxAlertManagementConfig => {
          return {
            ...this.config,
            thresholds: this.config.thresholds.map((threshold: NxAlertManagementConfigThreshold, index: number) => {
              const updatedItem = formArray[index];
              return {
                ...threshold,
                value: updatedItem[THRESHOLDS_KEY],
                timeOverMinutes: updatedItem[TIME_OVER_MINUTES_KEY]
              };
            })
          };
        }),
      ).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.thresholdsArray.disable({emitEvent: false, onlySelf: true}) :
      this.thresholdsArray.enable({emitEvent: false, onlySelf: true});
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.thresholdsArray.valid ? null : {multiThreshold: {valid: false}};
  }

  getFormGroup(ctrl: AbstractControl): FormGroup {
    return ctrl as FormGroup;
  }

  private buildFormGroup(threshold: NxAlertManagementConfigThreshold): FormGroup {
    this.thresholdFields.push({
      [THRESHOLDS_KEY]: new SimpleInputModel(
        HtmlInputTypesEnum.number,
        threshold.name ?? threshold.label,
        '0',
        threshold.comparator,
        threshold.units
      ),
      [TIME_OVER_MINUTES_KEY]: TimeOverMinutesInputModel
    });

    return this.fb.group({
        [this.staticThresholdKey]: this.fb.control(threshold.value, [
          Validators.required,
          this.formValidationService.number(),
          Validators.min(0),
          Validators.max(threshold.units === '%' ? 100 : BASE_INTEGERS.MAX_JAVA_INTEGER),
          this.formValidationService.wholeNumber()
        ]),
        [this.staticTimeOverMinutesKey]: this.fb.control(threshold.timeOverMinutes, [
          Validators.required,
          this.formValidationService.number(),
          Validators.min(0),
          Validators.max(BASE_INTEGERS.MAX_JAVA_INTEGER),
          this.formValidationService.wholeNumber()
        ])
      }
    );
  }
}
