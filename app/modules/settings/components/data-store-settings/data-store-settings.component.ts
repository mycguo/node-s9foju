import { DataManagementNodeConfigRecord } from '../../services/data-management/interfaces/data-management-node-config-record';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import { SimpleInputModel } from '../../../shared/components/form/simple-input/models/simple-input.model';
import { DataStoreSettingsConfig } from './interfaces/data-store-settings-config';
import { CommonService } from '../../../../utils/common/common.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder, FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {DataStoreType} from '../../services/data-management/enums/data-store-type.enum';
import LaRegexpConstant from '../../../../../../../client/laCommon/constants/laRegexp.constant';
import { NodeDataStoreSettingsKeys } from '../node-data-store-settings/node-data-store-settings-keys.enum';

@UntilDestroy()
@Component({
  selector: 'nx-data-store-settings',
  templateUrl: './data-store-settings.component.html',
  styleUrls: [
    './data-store-settings.component.less'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataStoreSettingsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DataStoreSettingsComponent),
      multi: true
    }
  ]
})
export class DataStoreSettingsComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

  public readonly ENABLE_BYTES_USED_WARNING_CONTROL_LABEL = 'Display a warning when any database exceeds:';
  public readonly PURGE_AUTOMATICALLY_CONTROL_LABEL = 'Automatically purge data older than:';
  public readonly ARCHIVE_ON_PURGE_CONTROL_LABEL = 'Before purging, archive to:';

  readonly AGE_CONTROL_MAX_VALUE = {
    [DataStoreType.SNMP]: 999,
    [DataStoreType.FLOW]: 999,
    [DataStoreType.ALERT]: 999,
    [DataStoreType.LONG_TERM]: 999
  };

  @Input() settings: DataManagementNodeConfigRecord;
  @Input() allowEditing = false;
  @Input() allowBackup = true;
  @Input() disableActions = false;

  @Output() backup = new EventEmitter<DataStoreType>();
  @Output() purge = new EventEmitter<DataStoreType>();
  @Output() reset = new EventEmitter<DataStoreType>();

  inputModels: {[key: string]: SimpleInputModel} = {};
  formGroup: FormGroup;
  onTouched: () => void;

  get bytesUsedWarningThresholdControlName(): string {
    return NodeDataStoreSettingsKeys.BYTES_USED_WARNING_THRESHOLD_KEY;
  }

  get purgeAutomaticallyControlName(): string {
    return NodeDataStoreSettingsKeys.PURGE_AUTOMATICALLY_KEY;
  }

  get purgeAgeControlName(): string {
    return NodeDataStoreSettingsKeys.PURGE_AGE_KEY;
  }

  get archiveDirectoryControlName(): string {
    return NodeDataStoreSettingsKeys.ARCHIVE_DIRECTORY_KEY;
  }

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initForm(this.settings);
  }

  private initForm(settings: DataManagementNodeConfigRecord): void {
    this.formGroup = this.fb.group({
      [this.bytesUsedWarningThresholdControlName]: new FormControl(
        settings?.enableBytesUsedWarning ? settings?.bytesUsedWarningThreshold : null,
        [Validators.min(1)]
      ),
      [this.purgeAutomaticallyControlName]: new FormControl(settings?.purgeAutomatically),
      [this.purgeAgeControlName]: new FormControl(
        settings?.purgeAge || null,
        [
          Validators.required,
          Validators.pattern(LaRegexpConstant.WHOLE_NUMBERS_PATTERN),
          Validators.min(1),
          Validators.max(this.AGE_CONTROL_MAX_VALUE[settings?.dataStoreType])
        ]
      ),
      [this.archiveDirectoryControlName]: new FormControl(settings?.archiveOnPurge ? settings?.archiveDirectory : null)
    });
    this.initFormFieldsModels();
  }

  private initFormFieldsModels(): void {

    this.inputModels[this.bytesUsedWarningThresholdControlName] = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      this.ENABLE_BYTES_USED_WARNING_CONTROL_LABEL,
      'Type MB there',
      void 0,
      'MB'
    );

    this.inputModels[this.purgeAgeControlName] = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      void 0,
      'Type days here',
      void 0,
      'Days',
      void 0,
      {required: () => 'Invalid number', pattern: () => 'Invalid number'}
    );

    this.inputModels[this.archiveDirectoryControlName] = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      this.ARCHIVE_ON_PURGE_CONTROL_LABEL,
      'Type directory here'
    );
  }

  writeValue(value: DataStoreSettingsConfig): void {
    if (!this.commonService.isNil(value) && !this.commonService.isEmpty(value)) {
      this.formGroup.patchValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges
      .pipe(untilDestroyed(this), debounceTime(0))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
     !this.commonService.isNil(changes?.allowEditing?.currentValue) &&
      !changes?.allowEditing?.isFirstChange() &&
      !this.commonService.isEqual(changes?.allowEditing?.currentValue, changes?.allowEditing?.previousValue)
    ) {
      if (this.allowEditing) {
        this.updateFormGroupValue(this.settings);
      }
    }
  }

  private updateFormGroupValue(settings: DataManagementNodeConfigRecord): void {
    this.formGroup.patchValue({
      [this.bytesUsedWarningThresholdControlName]:
        settings?.enableBytesUsedWarning ? settings[this.bytesUsedWarningThresholdControlName] : null,
      [this.purgeAutomaticallyControlName]: settings[this.purgeAutomaticallyControlName],
      [this.purgeAgeControlName]: settings[this.purgeAgeControlName],
      [this.archiveDirectoryControlName]: settings?.archiveOnPurge ? settings[this.archiveDirectoryControlName] : null,
    }, { emitEvent: false, onlySelf: true });
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.formGroup.valid ? null : { invalidForm: {valid: false, message: `${this.settings.dataStoreType} settings are invalid`}};
  }

  backupClick(): void {
    this.backup.emit(this.settings.dataStoreType);
  }

  purgeClick(): void {
    this.purge.emit(this.settings.dataStoreType);
  }

  resetClick(): void {
    this.reset.emit(this.settings.dataStoreType);
  }

  onTouch = () => void 0;

  ngOnDestroy() {}
}
