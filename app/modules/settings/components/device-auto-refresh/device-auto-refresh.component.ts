import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {DeviceAutoRefreshProperties} from './models/device-auto-refresh-properties/device-auto-refresh-properties';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import {ToggleModel} from '../../../shared/components/form/toggle/models/toggle.model';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import LaRegexpConstant from '../../../../../../../client/laCommon/constants/laRegexp.constant';
import { FormStatus } from '../../../shared/enums/form-status.enum';

const deviceAutoRefreshDefaultState = false;
const refreshTimeIntervalDefaultValue = 1;

@UntilDestroy()
@Component({
  selector: 'nx-device-auto-refresh',
  templateUrl: './device-auto-refresh.component.html',
  styleUrls: ['./device-auto-refresh.component.less']
})
export class DeviceAutoRefreshComponent implements OnChanges, OnInit, OnDestroy {
  public static readonly ENABLE_AUTO_REFRESH_KEY = 'enableAutoRefresh';
  public static readonly AUTO_REFRESH_INTERVAL_DAYS_KEY = 'autoRefreshIntervalInDays';

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() autoRefreshProperties: DeviceAutoRefreshProperties =
    new DeviceAutoRefreshProperties(true, 5);
  @Output() submit: EventEmitter<DeviceAutoRefreshProperties> = new EventEmitter();

  public formGroup: FormGroup;
  public refreshTimeIntervalInputField: SimpleInputModel;
  public enableAutoRefreshToggle: ToggleModel;

  constructor(private fb: FormBuilder) {
  }

  get staticEnableAutoRefreshKey(): string {
    return DeviceAutoRefreshComponent.ENABLE_AUTO_REFRESH_KEY;
  }

  get staticAutoRefreshIntervalDaysKeys(): string {
    return DeviceAutoRefreshComponent.AUTO_REFRESH_INTERVAL_DAYS_KEY;
  }

  get isSubmitButtonDisabled(): boolean {
    return this.formGroup.invalid || this.formGroup.pristine || this.isRevertChangesButtonDisabled;
  }

  get isRevertChangesButtonDisabled(): boolean {
    return this.autoRefreshProperties.enableAutoRefresh === this.formGroup.getRawValue()[this.staticEnableAutoRefreshKey] &&
      this.autoRefreshProperties.autoRefreshIntervalInDays === this.formGroup.getRawValue()[this.staticAutoRefreshIntervalDaysKeys];
  }

  ngOnInit(): void {
    this.initForm(this.autoRefreshProperties);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.autoRefreshProperties && changes.autoRefreshProperties.currentValue && !changes.autoRefreshProperties.isFirstChange()) {
      this.formGroup.patchValue(changes.autoRefreshProperties.currentValue);
    }
  }

  ngOnDestroy(): void {
  }

  public submitChanges(): void {
    // use raw value incase days are isDisabled (won't send value)
    this.submit.emit(this.formGroup.getRawValue());
  }

  private initForm(autoRefreshProperties: DeviceAutoRefreshProperties): void {
    this.refreshTimeIntervalInputField = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      'Refresh Time Interval',
      '', void 0,
      'days');

    this.enableAutoRefreshToggle = new ToggleModel('Enabled', 'Disabled');

    this.formGroup = this.fb.group({
      [this.staticEnableAutoRefreshKey]: autoRefreshProperties.enableAutoRefresh,
      [this.staticAutoRefreshIntervalDaysKeys]: this.fb.control(
        {
          value: autoRefreshProperties ? autoRefreshProperties.autoRefreshIntervalInDays : refreshTimeIntervalDefaultValue,
          disabled: autoRefreshProperties ? !autoRefreshProperties.enableAutoRefresh : !deviceAutoRefreshDefaultState
        })
    });

    this.updateIntervalDaysControl(autoRefreshProperties.enableAutoRefresh);

    this.formGroup.get(this.staticEnableAutoRefreshKey).valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((isEnabled: boolean) => {
        this.updateIntervalDaysControl(isEnabled);
      });

    this.formGroup.get(this.staticAutoRefreshIntervalDaysKeys).statusChanges
      .pipe(untilDestroyed(this))
      .subscribe(status => {

        // Disable "enable auto refresh" toggle element if amount of interval days is not valid
        if (status === FormStatus.INVALID) {
          this.formGroup.get(this.staticEnableAutoRefreshKey).disable({onlySelf: true, emitEvent: false});
          return;
        }
        this.formGroup.get(this.staticEnableAutoRefreshKey).enable({onlySelf: true, emitEvent: false});
      });
  }

  public revertChanges(): void {
    this.formGroup.patchValue(this.autoRefreshProperties);
  }

  private updateIntervalDaysControl(isEnabled: boolean): void {
    const intervalDaysControl = this.formGroup.get(this.staticAutoRefreshIntervalDaysKeys);
    if (isEnabled) {
      intervalDaysControl.enable();
      intervalDaysControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.pattern(LaRegexpConstant.WHOLE_NUMBERS_PATTERN)
      ]);
    } else {
      intervalDaysControl.disable();
      intervalDaysControl.setValidators(null);
    }
    intervalDaysControl.updateValueAndValidity();
  }
}
