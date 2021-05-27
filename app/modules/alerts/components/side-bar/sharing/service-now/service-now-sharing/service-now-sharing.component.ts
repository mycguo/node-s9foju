import {Component, Input, OnChanges, OnInit, Self, SimpleChanges} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  ValidationErrors
} from '@angular/forms';
import {ServiceNowCourier} from '../../../../../services/couriers/models/service-now-courier';
import {CommonService} from '../../../../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {map} from 'rxjs/operators';
import ServiceNowCourierConfig from '../../../../../../integrations/services/service-now-courier-config/models/service-now-courier-config';
import {TOOLTIP_ALIGNMENT_ENUM} from '../../../../../../shared/components/tooltip/enum/tooltip-alignment.enum';
import {CvaUtils} from '../../../../../../../utils/cva-utils/cva-utils';

@UntilDestroy()
@Component({
  selector: 'nx-service-now-sharing',
  templateUrl: './service-now-sharing.component.html',
  styleUrls: ['./service-now-sharing.component.less']
})
export class ServiceNowSharingComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() isLoading: boolean;
  @Input() isIncidentType: boolean;
  @Input() isConfigured: boolean;

  readonly ENABLED_KEY = 'enabled';
  readonly OVERRIDES_KEY = 'overrides';
  readonly configureUrl = 'livenx/settings/external?tabId=ServiceNow';

  displayName: string;
  showSettings: boolean;

  serviceNowCourier: ServiceNowCourier;
  serviceNowFormGroup: FormGroup;

  showTooltip = false;
  TOOLTIP_ALIGNMENT = TOOLTIP_ALIGNMENT_ENUM;

  onTouched: () => void;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private commonService: CommonService) {
    controlDir.valueAccessor = this;
    this.serviceNowFormGroup = this.fb.group({
      [this.ENABLED_KEY]: this.fb.control({value: false}),
      [this.OVERRIDES_KEY]: this.fb.control([])
    });
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  ngOnInit() {
    const validators = this.control.validator ?
      [this.control.validator, this.validateFormGroup.bind(this)] :
      this.validateFormGroup.bind(this);
    this.control.setValidators(validators);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.commonService.isNil(changes?.isConfigured?.currentValue)) {
      const isConfigured = changes.isConfigured.currentValue;
      isConfigured ?
        this.serviceNowFormGroup.enable({emitEvent: false, onlySelf: true}) :
        this.serviceNowFormGroup.disable({emitEvent: false, onlySelf: true});
      if (isConfigured) {
        this.setShowSettings(this.serviceNowCourier?.enabled);
      }
    }
  }

  writeValue(obj: ServiceNowCourier) {
    if (!this.commonService.isNil((obj))) {
      this.displayName = obj.displayName;
      this.serviceNowCourier = obj;
      this.serviceNowFormGroup.patchValue({
        [this.ENABLED_KEY]: obj.enabled,
        [this.OVERRIDES_KEY]: obj.fieldOptions
      });
      this.setShowSettings(obj.enabled);
    }
  }

  registerOnChange(fn: (updates: ServiceNowCourier) => void) {
    this.serviceNowFormGroup.valueChanges
      .pipe(
        untilDestroyed(this),
        map((form: {
          enabled: boolean,
          overrides: Array<ServiceNowCourierConfig>
        }): ServiceNowCourier => {
          return new ServiceNowCourier(
            {
              id: this.serviceNowCourier?.id,
              scope: this.serviceNowCourier?.scope,
              enabled: form[this.ENABLED_KEY],
              fieldOptions: form[this.OVERRIDES_KEY]
            });
        })
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.isConfigured) {
      this.setShowSettings(this.serviceNowCourier.enabled);
      isDisabled ? this.serviceNowFormGroup.disable({emitEvent: false, onlySelf: true}) :
        this.serviceNowFormGroup.enable({emitEvent: false, onlySelf: true});
    }
  }

  private validateFormGroup(control: AbstractControl): ValidationErrors {
    const errors = CvaUtils.extractControlErrors(this.serviceNowFormGroup?.controls);
    return this.serviceNowFormGroup.valid ? null : errors;
  }

  /**
   * ensures showSettings is properly set
   */
  private setShowSettings(enabled: boolean): void {
    this.showSettings = this.serviceNowFormGroup.enabled && enabled;
  }
}
