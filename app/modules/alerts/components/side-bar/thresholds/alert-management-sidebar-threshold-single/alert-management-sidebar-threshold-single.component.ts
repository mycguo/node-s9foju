import {Component, OnInit, Self} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl, ValidationErrors, Validator,
  Validators
} from '@angular/forms';
import {SimpleInputModel} from '../../../../../shared/components/form/simple-input/models/simple-input.model';
import {CommonService} from '../../../../../../utils/common/common.service';
import {FormValidationService} from '../../../../../../services/form-validation/form-validation.service';
import HtmlInputTypesEnum from '../../../../../shared/components/form/simple-input/models/html-input-types.enum';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import NxAlertManagementConfig from '../../../../services/nx-alert-management/models/nx-alert-management-config';
import {map} from 'rxjs/operators';
import NxAlertManagementConfigThreshold from '../../../../services/nx-alert-management/models/nx-alert-management-config-threshold';
import {TIME_OVER_MINUTES_KEY, TimeOverMinutesInputModel} from '../../../../constants/time-over-minutes.constants';
import {THRESHOLDS_KEY} from '../threshold-keys';
import { BASE_INTEGERS } from '../../../../../../constants/base-integers.enum';

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-sidebar-threshold-single',
  templateUrl: './alert-management-sidebar-threshold-single.component.html',
  styleUrls: ['./alert-management-sidebar-threshold-single.component.less']
})
export class AlertManagementSidebarThresholdSingleComponent implements OnInit, ControlValueAccessor, Validator {

  config: NxAlertManagementConfig;

  thresholdConfigForm: FormGroup;
  thresholdField: SimpleInputModel;
  timeOverMinutesField: SimpleInputModel;

  onTouched: () => void;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private commonService: CommonService,
              private formValidationService: FormValidationService) {
    controlDir.valueAccessor = this;
    this.timeOverMinutesField = TimeOverMinutesInputModel;

    this.thresholdConfigForm = this.fb.group({
      [this.staticThresholdKey]: [void 0],
      [this.staticTimeOverMinutesKey]: [0, [
        Validators.required,
        this.formValidationService.number(),
        Validators.min(0),
        Validators.max(BASE_INTEGERS.MAX_JAVA_INTEGER),
        this.formValidationService.wholeNumber()
      ]
      ]
    });
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

  ngOnInit(): void {
    // explicitly ignoring validators on control
    this.control.setValidators(this.validate.bind(this));
  }

  writeValue(config: NxAlertManagementConfig): void {
    if (!this.commonService.isNil(config)) {
      // assumes only a single threshold
      this.config = config;
      let threshold: NxAlertManagementConfigThreshold;

      if (config.thresholds.length === 1) {
        threshold = config.thresholds[0];
        this.thresholdField = new SimpleInputModel(
          HtmlInputTypesEnum.number,
          threshold.label ?? threshold.name,
          '0',
          threshold.comparator,
          threshold.units
        );
      }
      this.updateForm(threshold?.value, config.timeOverMinutes, threshold?.units);
    }
  }

  registerOnChange(fn: (config: NxAlertManagementConfig) => void): void {
    this.thresholdConfigForm.valueChanges.pipe(
      untilDestroyed(this),
      map((form: {
        [THRESHOLDS_KEY]: number
        [TIME_OVER_MINUTES_KEY]: number
      }): NxAlertManagementConfig => {
        const thresholds: Array<NxAlertManagementConfigThreshold> = this.commonService.cloneDeep(this.config.thresholds);
        if (form[THRESHOLDS_KEY] != null) {
          thresholds[0].value = form[THRESHOLDS_KEY];
        }
        return {
          ...this.config,
          ...{
            thresholds: thresholds,
            timeOverMinutes: form[TIME_OVER_MINUTES_KEY]
          }
        } as NxAlertManagementConfig;
      })
    ).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.thresholdConfigForm.disable({emitEvent: false, onlySelf: true}) :
      this.thresholdConfigForm.enable({emitEvent: false, onlySelf: true});
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.thresholdConfigForm.valid ? null : {singleThreshold: {valid: false}};
  }

  private updateForm(thresholdVal: number, timeOverMinutesVal: number, thresholdUnits: string): void {
    if (thresholdVal == null) {
      this.thresholdConfigForm.patchValue({
        [this.staticTimeOverMinutesKey]: timeOverMinutesVal
      });
      this.thresholdConfigForm.get(this.staticThresholdKey).setValidators([]); // clear validators
    } else {
      this.thresholdConfigForm.get(this.staticThresholdKey).setValidators([
        Validators.required,
        this.formValidationService.number(),
        Validators.min(0),
        Validators.max(thresholdUnits === '%' ? 100 : BASE_INTEGERS.MAX_JAVA_INTEGER),
        this.formValidationService.wholeNumber()
      ]);
      this.thresholdConfigForm.patchValue({
        [this.staticThresholdKey]: thresholdVal,
        [this.staticTimeOverMinutesKey]: timeOverMinutesVal
      });
    }
  }
}
