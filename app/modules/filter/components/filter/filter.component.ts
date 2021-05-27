import { Component, ElementRef, Input, OnInit, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { iif, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import { FormField } from '../../../shared/components/form/form-field/form-field';
import { FilterOptionsValue } from '../../interfaces/filter-options-value';
import { FilterVariables } from '../../constants/filter-variables';
import { FilterService } from '../../services/filter/filter.service';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import { NotificationDowngradeService } from '../../../../services/notification-downgrade/notification-downgrade.service';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { FilterValue } from '../../interfaces/filter-value';

@UntilDestroy()
@Component({
  selector: 'nx-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class FilterComponent implements OnInit, ControlValueAccessor {

  @Input() displayModel: FormField = {};
  @Input() filterOptions: LaFilterSupportEnums[];
  @Input() filterOptionsValue: FilterOptionsValue;
  @Input() showSaveButton: boolean;
  @Input() showApplyButton: boolean;
  @Input() showFlexStringButton: boolean;

  ACTION_ICON_BUTTON_WIDTH = FilterVariables.ACTION_ICON_BUTTON_WIDTH;

  filterFormControl: FormControl;
  selectedFlexString: string;
  isInvalidFlexString: boolean;
  isFlexFilterColumnExists: boolean;
  isFlexFilterSelected: boolean;

  private _onTouched: () => void;
  private _onChange: (filterValues: FilterValue) => void = () => void 0;

  constructor(
    @Self() private controlDir: NgControl,
    private filterService: FilterService,
    private notificationService: NotificationService,
    public hostElRef: ElementRef
  ) {
    controlDir.valueAccessor = this;
    this.filterFormControl = new FormControl();

  }

  ngOnInit(): void {
    // subscribe to filter-input value changes and update this component CVA value only if apply button displayed
    this.filterFormControl.valueChanges
      .pipe(
        untilDestroyed(this),
        tap((value: FilterValue) => {
          this.isFlexFilterSelected = this.isFlexFilterAdded(value);
        }),
        mergeMap(value => iif(() => !this.showApplyButton, of(value)))
      )
      .subscribe((value: FilterValue) => {
        this._onChange(value);
      });

    this.isFlexFilterColumnExists = this.filterOptions?.some(option => option === LaFilterSupportEnums.FLEX_STRING);
    this.filterFormControl.setValidators(this.control.validator);
  }

  private get control(): AbstractControl {
    return this.controlDir?.control;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: FilterValue): void {
    if (obj != null) {
      this.isFlexFilterSelected = this.isFlexFilterAdded(obj);
      this.filterFormControl.setValue(obj, { emitEvent: false });
    }
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.filterFormControl.disable() : this.filterFormControl.enable();
  }

  copyFlexSearchString(): void {
    this.notificationService.sendNotification$(
      new LaCustomNotificationDefinition('Flex Search Copied to Clipboard', NOTIFICATION_TYPE_ENUM.SUCCESS)
    );
  }

  buildFlexString(): void {
    const flexString = this.filterService.buildFlexSearchString(this.filterFormControl.value);
    if (flexString === '') {
      this.selectedFlexString = 'Current filters do not resolve to a valid flex search';
      this.isInvalidFlexString = true;
    } else {
      this.selectedFlexString = flexString;
      this.isInvalidFlexString = false;
    }
  }

  convertToFlexSearchTag(): void {
    const flexFilterValue: FilterValue = {
      [LaFilterSupportEnums.FLEX_STRING]: [this.selectedFlexString]
    };
    this.filterFormControl.setValue(flexFilterValue);
  }

  onSubmit(): void {
    this._onChange(this.filterFormControl.value);
    this.filterFormControl.markAsPristine();
  }

  private isFlexFilterAdded(value: FilterValue): boolean {
    return value !== null && Object.keys(value).some(entity => entity === LaFilterSupportEnums.FLEX_STRING);
  }

}
