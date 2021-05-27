import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {TimeRangeRestrictionOption} from './models/time-range-restriction-option';
import {SelectInput} from '../../../shared/components/form/select/models/select-input';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {NotificationLabelStatus} from '../../../shared/components/notification-label/enums/notification-label-status.enum';
import {TimeRangeRestrictionId} from '../../../../../../../server/api/laReport/reportTemplateConstants';
import DetailedError from '../../../shared/components/loading/detailed-error';

@UntilDestroy()
@Component({
  selector: 'nx-time-range-restriction-setting',
  templateUrl: './time-range-restriction-setting.component.html',
  styleUrls: ['./time-range-restriction-setting.component.less']
})
export class TimeRangeRestrictionSettingComponent implements OnChanges, OnInit {
  public static readonly TIME_RANGE_RESTRICTION = 'timeRangeRestriction';
  public readonly warningStatus: NotificationLabelStatus = NotificationLabelStatus.WARNING;

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() timeRangeRestrictionOptions: Array<TimeRangeRestrictionOption>;
  @Input() selectedTimeRangeOption: TimeRangeRestrictionOption;
  @Output() submit = new EventEmitter<TimeRangeRestrictionOption>();

  public formGroup: FormGroup;
  public selectModel: SelectInput;
  public showWarningMessage: boolean;

  constructor(private fb: FormBuilder) {
    this.showWarningMessage = false;
    this.selectModel = new SelectInput([], 'Analysis reports time range limit');
    this.formGroup = this.fb.group({
      [this.staticTimeRangeRestrictionKey]: null
    });
  }

  get staticTimeRangeRestrictionKey(): string {
    return TimeRangeRestrictionSettingComponent.TIME_RANGE_RESTRICTION;
  }


  ngOnInit(): void {
    this.formGroup.get(this.staticTimeRangeRestrictionKey).valueChanges
      .pipe(untilDestroyed((this)))
      .subscribe(val => {
        this.showWarningMessage = this.shouldShowWarning(val);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.timeRangeRestrictionOptions?.currentValue && !changes?.timeRangeRestrictionOptions?.isFirstChange()) {
      const timeRangeRestrictionOptions: Array<TimeRangeRestrictionOption> = changes?.timeRangeRestrictionOptions?.currentValue;
      this.selectModel.options = timeRangeRestrictionOptions.map((option => new SelectOption(option.id, option.label)));
    }
    if (changes?.selectedTimeRangeOption?.currentValue && !changes?.selectedTimeRangeOption?.isFirstChange()) {
      const selectedTimeRangeOption: TimeRangeRestrictionOption = changes?.selectedTimeRangeOption?.currentValue;
      this.formGroup.reset({
        [this.staticTimeRangeRestrictionKey]: selectedTimeRangeOption?.id
      });
    }
  }

  public submitChanges(): void {
    const selectedId: string = this.formGroup.get(this.staticTimeRangeRestrictionKey).value;
    this.submit.emit(this.timeRangeRestrictionOptions.find((option) => option?.id === selectedId));
    this.formGroup.markAsPristine();
  }

  /**
   *  Determine if a warning message about possible performance issues should be shown.
   */
  private shouldShowWarning(selectedOptionId: string): boolean {
    return selectedOptionId === TimeRangeRestrictionId.NONE;
  }
}
