import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {ReportHistory} from '../../services/report-history/models/report-history.interface';
import {ReportHistoryValidation} from '../../services/report-history/models/report-history-validation.interface';
import {ReportStorage} from '../../services/report-storage/models/report-storage';
import {CommonService} from '../../../../utils/common/common.service';
import {ReportHistoryService} from '../../services/report-history/report-history.service';
import SizeUnitsEnum from '../../../shared/enums/size-units.enum';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';
import {DiskStorageCapacityLegendItem} from '../disk-storage-capacity/models/disk-storage-capacity-legend-item/disk-storage-capacity-legend-item';
import {SubmitEmitterData} from './models/submit-emitter-data/submit-emitter-data';
import {UnitConversionUtilities} from '../../../../services/unit-conversion-utilities/unit-conversion-utilities.service';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import LaRegexpConstant from '../../../../../../../client/laCommon/constants/laRegexp.constant';

@UntilDestroy()
@Component({
  selector: 'nx-report-history',
  templateUrl: './report-history.component.html',
  styleUrls: ['./report-history.component.less']
})
export class ReportHistoryComponent implements OnInit, OnChanges, OnDestroy {
  static readonly HISTORY_FORM_KEY = 'history';
  static readonly STORAGE_KEY = 'storage';
  static readonly ADHOC_DAYS_KEY = 'adhocDays';
  static readonly SCHEDULE_DAYS_KEY = 'scheduledDays';
  static readonly SHARED_DAYS_KEY = 'sharedDays';
  static readonly REPORT_STORE_DISPLAY_NAME = 'Report';

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() reportHistory: ReportHistory;
  @Input() reportHistoryValidation: ReportHistoryValidation;
  @Input() storage: ReportStorage;
  @Output() submit: EventEmitter<SubmitEmitterData> = new EventEmitter();

  formGroup: FormGroup;
  diskStorageField: SimpleInputModel;
  adhocDaysField: SimpleInputModel;
  scheduledDaysField: SimpleInputModel;
  sharedDaysField: SimpleInputModel;

  isResetToDefaultDisabled: boolean;
  diskStorageCapacityLegend: DiskStorageCapacityLegendItem[];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private formValidationService: FormValidationService,
    private dataUnitsScaleService: UnitConversionUtilities
  ) {
    this.diskStorageField = new SimpleInputModel(HtmlInputTypesEnum.number, void 0, void 0, void 0, SizeUnitsEnum.GB);
    this.adhocDaysField = new SimpleInputModel(HtmlInputTypesEnum.number, 'AD HOC Reports', void 0, void 0, 'Days');
    this.scheduledDaysField = new SimpleInputModel(HtmlInputTypesEnum.number, 'Scheduled Reports', void 0, void 0, 'Days');
    this.sharedDaysField = new SimpleInputModel(HtmlInputTypesEnum.number, 'Shared Reports', void 0, void 0, 'Days');

    this.formGroup = this.fb.group({
      [this.staticStorageKey]: [],
      [this.staticHistoryFormKey]: this.fb.group({
        [this.staticAdhocDaysKey]: [],
        [this.staticScheduleDaysKey]: [],
        [this.staticSharedDaysKey]: []
      })
    });
  }

  get staticHistoryFormKey(): string {
    return ReportHistoryComponent.HISTORY_FORM_KEY;
  }

  get staticStorageKey(): string {
    return ReportHistoryComponent.STORAGE_KEY;
  }

  get staticAdhocDaysKey(): string {
    return ReportHistoryComponent.ADHOC_DAYS_KEY;
  }

  get staticScheduleDaysKey(): string {
    return ReportHistoryComponent.SCHEDULE_DAYS_KEY;
  }

  get staticSharedDaysKey(): string {
    return ReportHistoryComponent.SHARED_DAYS_KEY;
  }

  ngOnInit() {
    this.initData();
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.storage && !changes.storage.firstChange &&
      changes.storage.currentValue.reportCacheStorageLimit !== changes.storage.previousValue.reportCacheStorageLimit) {
      const reportStorage = this.diskStorageCapacityLegend
        .find((legendItem) => legendItem.storeName === ReportHistoryComponent.REPORT_STORE_DISPLAY_NAME);
      if (reportStorage) {
        reportStorage.storeMaxValue = changes.storage.currentValue.reportCacheStorageLimit;
      }
    }
    this.updateForm();
  }

  onSubmit(): void {
    this.submit.emit(new SubmitEmitterData(
      this.dataUnitsScaleService.convertBytes(
        this.formGroup.get(ReportHistoryComponent.STORAGE_KEY).value, SizeUnitsEnum.GB, SizeUnitsEnum.Bytes),
      this.formGroup.get(ReportHistoryComponent.HISTORY_FORM_KEY).value
    ));
  }

  setFormPristine(): void {
    this.formGroup.markAsPristine();
  }

  onRevert(): void {
    this.formGroup.reset({
      [ReportHistoryComponent.STORAGE_KEY]: this.dataUnitsScaleService.convertBytes(
        this.storage.reportCacheStorageLimit, SizeUnitsEnum.Bytes, SizeUnitsEnum.GB
      ),
      [ReportHistoryComponent.HISTORY_FORM_KEY]: {
        [ReportHistoryComponent.ADHOC_DAYS_KEY]: this.reportHistory.adhocDays,
        [ReportHistoryComponent.SCHEDULE_DAYS_KEY]: this.reportHistory.scheduledDays,
        [ReportHistoryComponent.SHARED_DAYS_KEY]: this.reportHistory.sharedDays,
      }
    });
    this.setFormPristine();
  }

  onResetDefault(): void {
    this.formGroup.get(ReportHistoryComponent.HISTORY_FORM_KEY).markAsDirty();
    this.formGroup.get(ReportHistoryComponent.HISTORY_FORM_KEY).markAsTouched();
    this.formGroup.get(ReportHistoryComponent.HISTORY_FORM_KEY).setValue(ReportHistoryService.DEFAULT_REPORT_HISTORY_SETTINGS);
    this.formGroup.get(ReportHistoryComponent.STORAGE_KEY).setValue(
      this.dataUnitsScaleService.convertBytes(this.storage && this.storage.diskSizeTotal, SizeUnitsEnum.Bytes, SizeUnitsEnum.GB)
    );
    this.isResetToDefaultDisabled = this.isFormSetDefaultValue(this.formGroup.get(ReportHistoryComponent.STORAGE_KEY).value,
      this.formGroup.get(ReportHistoryComponent.HISTORY_FORM_KEY).value);
  }

  private initData(): void {
    this.initLegend();
    this.isResetToDefaultDisabled = this.commonService.isEqual(this.reportHistory, ReportHistoryService.DEFAULT_REPORT_HISTORY_SETTINGS);
  }

  private initLegend(): void {
    this.diskStorageCapacityLegend = [
      new DiskStorageCapacityLegendItem(
        ReportHistoryComponent.REPORT_STORE_DISPLAY_NAME,
        this.storage && (this.storage.resultStoreSize > -1 ? this.storage.resultStoreSize : 0),
        true,
        this.storage && this.storage.reportCacheStorageLimit
      )
    ];
  }

  private updateForm(): void {
    this.formGroup.setValue({
      [this.staticStorageKey]: [this.getStorageValue()],
      [this.staticHistoryFormKey]: {
        [this.staticAdhocDaysKey]: [this.getAdhocDays()],
        [this.staticScheduleDaysKey]: [this.getScheduleDays()],
        [this.staticSharedDaysKey]: [this.getSharedDays()]
      }
    });
    this.formGroup.get(this.staticStorageKey).setValidators(this.storageValidation());
    this.formGroup.get(`${this.staticHistoryFormKey}.${this.staticAdhocDaysKey}`).setValidators(this.adhocDaysValidation());
    this.formGroup.get(`${this.staticHistoryFormKey}.${this.staticScheduleDaysKey}`).setValidators(this.scheduleDaysValidation());
    this.formGroup.get(`${this.staticHistoryFormKey}.${this.staticSharedDaysKey}`).setValidators(this.sharedDaysValidation());

    this.formGroup.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((form: { [ReportHistoryComponent.STORAGE_KEY]: number, [ReportHistoryComponent.HISTORY_FORM_KEY]: ReportHistory }) => {
        this.isResetToDefaultDisabled = this.isFormSetDefaultValue(
          form[ReportHistoryComponent.STORAGE_KEY],
          form[ReportHistoryComponent.HISTORY_FORM_KEY]);
      });

    this.setFormPristine();
  }

  private isFormSetDefaultValue(reportCacheStorageLimitGb: number, historyData: ReportHistory): boolean {
    if (historyData) {
      historyData.adhocDays = Number(historyData.adhocDays);
      historyData.scheduledDays = Number(historyData.scheduledDays);
      historyData.sharedDays = Number(historyData.sharedDays);

      return this.commonService.isEqual(
        Number(reportCacheStorageLimitGb),
        this.dataUnitsScaleService.convertBytes(this.storage && this.storage.diskSizeTotal, SizeUnitsEnum.Bytes, SizeUnitsEnum.GB)
      ) && this.commonService.isEqual(historyData, ReportHistoryService.DEFAULT_REPORT_HISTORY_SETTINGS);
    }

    return false;
  }

  private getStorageValue(): number {
    return this.dataUnitsScaleService.convertBytes(this.storage?.reportCacheStorageLimit,
      SizeUnitsEnum.Bytes,
      SizeUnitsEnum.GB);
  }

  private getAdhocDays(): number {
    return this.reportHistory?.adhocDays ?? ReportHistoryService.DEFAULT_REPORT_HISTORY_SETTINGS.adhocDays;
  }

  private getSharedDays(): number {
    return this.reportHistory?.sharedDays ?? ReportHistoryService.DEFAULT_REPORT_HISTORY_SETTINGS.sharedDays;
  }

  private getScheduleDays(): number {
    return this.reportHistory?.scheduledDays ?? ReportHistoryService.DEFAULT_REPORT_HISTORY_SETTINGS.scheduledDays;
  }

  private storageValidation(): Array<ValidatorFn> {
    const reportCacheStorageLimitGb = this.dataUnitsScaleService.convertBytes(
      this.storage && this.storage.diskSizeTotal, SizeUnitsEnum.Bytes, SizeUnitsEnum.GB);

    return [this.formValidationService.moreThan(9.3132257461548e-10, 0, {
      from: SizeUnitsEnum.GB,
      to: SizeUnitsEnum.Bytes,
      decimals: 11
    }),
      Validators.max(reportCacheStorageLimitGb),
      this.formValidationService.number()];
  }

  private adhocDaysValidation(): Array<ValidatorFn> {
    return !this.reportHistoryValidation ? [] : [
      Validators.min(this.reportHistoryValidation.adhoc.min),
      Validators.max(this.reportHistoryValidation.adhoc.max),
      Validators.pattern(LaRegexpConstant.WHOLE_NUMBERS_PATTERN),
      this.formValidationService.number()];
  }

  private scheduleDaysValidation(): Array<ValidatorFn> {
    return !this.reportHistoryValidation ? [] : [
      Validators.min(this.reportHistoryValidation.scheduled.min),
      Validators.max(this.reportHistoryValidation.scheduled.max),
      Validators.pattern(LaRegexpConstant.WHOLE_NUMBERS_PATTERN),
      this.formValidationService.number()];
  }

  private sharedDaysValidation(): Array<ValidatorFn> {
    return !this.reportHistoryValidation ? [] : [
      Validators.min(this.reportHistoryValidation.shared.min),
      Validators.max(this.reportHistoryValidation.shared.max),
      Validators.pattern(LaRegexpConstant.WHOLE_NUMBERS_PATTERN),
      this.formValidationService.number()];
  }
}
