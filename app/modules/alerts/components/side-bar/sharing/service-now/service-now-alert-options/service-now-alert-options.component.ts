import {
  Component,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {CommonService} from '../../../../../../../utils/common/common.service';
import {SelectService} from '../../../../../../shared/services/select/select.service';
import DetailedError from '../../../../../../shared/components/loading/detailed-error';
import {ServiceNowField} from '../../../../../../integrations/services/service-now-fields/models/service-now-field';
import {SelectInput} from '../../../../../../shared/components/form/select/models/select-input';
import ServiceNowCourierConfig from '../../../../../../integrations/services/service-now-courier-config/models/service-now-courier-config';
import {SelectOption} from '../../../../../../shared/components/form/select/models/select-option';
import {ServiceNowCourierConfigService} from '../../../../../../integrations/services/service-now-courier-config/service-now-courier-config.service';
import {ServiceNowFieldOptionsService} from '../../../../../../integrations/services/service-now-field-options/service-now-field-options.service';

/**
 * https://liveaction.atlassian.net/wiki/spaces/LA/pages/1720025210/9.5.0+ServiceNow+Alert+Override+Frontend+Design
 */
@Component({
  selector: 'nx-service-now-alert-options',
  templateUrl: './service-now-alert-options.component.html',
  styleUrls: ['./service-now-alert-options.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceNowAlertOptionsComponent),
      multi: true
    }
  ]
})
export class ServiceNowAlertOptionsComponent implements ControlValueAccessor, OnChanges {
  @HostBinding('class.nx-service-now-alert-options_is_loading') @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() fields: Array<ServiceNowField>;

  readonly OVERRIDE_LABEL = 'Add value to override';
  readonly OVERRIDE_PLACEHOLDER = 'Select override value from the list';

  courierConfig: { [key: string]: ServiceNowCourierConfig };
  selectedFields: Array<Array<ServiceNowField>>;
  fieldSelectModel: SelectInput;
  overrideModel: string;

  isDisabled: boolean;
  onTouched: () => void;
  onChanged: (val) => void;


  constructor(private commonService: CommonService,
              private selectService: SelectService,
              private serviceNowCourierConfigService: ServiceNowCourierConfigService) {
    this.courierConfig = {};
    this.selectedFields = [];
    this.fieldSelectModel = new SelectInput([], this.OVERRIDE_LABEL, this.OVERRIDE_PLACEHOLDER);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.fields?.currentValue != null) {
      this.fieldSelectModel = this.buildOverrideSelection(this.fields, this.courierConfig);
    }
  }

  // CVA START
  writeValue(obj: Array<ServiceNowCourierConfig>) {
    if (obj != null) {
      this.courierConfig = this.serviceNowCourierConfigService.transformConfigToObj(obj);
      this.fieldSelectModel = this.buildOverrideSelection(this.fields, this.courierConfig);
      this.selectedFields = this.buildSelectedFields(this.fields, this.courierConfig);
    }
  }

  registerOnChange(fn): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // CVA END

  /**
   *  when an override is selected from the drop down
   */
  overrideSelected(value: string): void {
    if (value != null) {
      // NOTE: ServiceNowField could have a child
      const selectedField: ServiceNowField = this.fields.find((field: ServiceNowField) => field.id === value);
      if (selectedField != null) {
        const flattenedField: Array<ServiceNowField> = this.getFlattenedFields(selectedField);
        flattenedField.forEach((field: ServiceNowField) => {
          this.courierConfig[field.fieldName] = {
            fieldName: field.fieldName,
            value: ServiceNowFieldOptionsService.NOT_CONFIGURED_VALUE,
            displayValue: ServiceNowFieldOptionsService.NOT_CONFIGURED_DISPLAY_VALUE
          } as ServiceNowCourierConfig;
        });
        this.selectedFields.push(flattenedField);
        // reevaluate override options (remove selected)
        this.fieldSelectModel = this.buildOverrideSelection(this.fields, this.courierConfig);
      }
      this.overrideModel = void 0;
      this.onTouched();
      this.changeHandler();
    }
  }

  /**
   * when an override item is deleted
   */
  removeOverride(index: number): void {
    if (this.selectedFields.length > 0) {
      // remove item from selectedFields
      const removedOption: Array<Array<ServiceNowField>> = this.selectedFields.splice(index, 1);
      removedOption[0].forEach((item: ServiceNowField) => {
        delete this.courierConfig[item.fieldName];
      });
    }
    this.onTouched();
    this.changeHandler();
  }

  changeHandler(): void {
    this.onChanged(Object.values(this.courierConfig));
  }

  // override
  private buildOverrideSelection(fields: Array<ServiceNowField>,
                                 courierConfig: { [key: string]: ServiceNowCourierConfig }): SelectInput {
    if (fields == null || fields.length === 0) {
      return this.fieldSelectModel; // return existing model
    } else {
      const options: Array<SelectOption> = fields
        .filter((field: ServiceNowField) => {
          return !Object.keys(courierConfig).includes(field.fieldName);
        })
        .map((field: ServiceNowField) => {
          return {id: field.id, name: `${field.displayValue}${this.buildOverrideName(field.child)}`} as SelectOption;
        })
        .sort(this.selectService.sortSelectOption);
      return new SelectInput(options,
        this.OVERRIDE_LABEL,
        this.OVERRIDE_PLACEHOLDER
      );
    }
  }

  /**
   * build override select name if nested (eg category/subcategory)
   */
  private buildOverrideName(item: ServiceNowField): string {
    if (item == null) {
      return '';
    } else {
      return ` / ${item.displayValue}${this.buildOverrideName(item.child)}`;
    }
  }

  //
  // /**
  //  * Builds an array of arrays of selected fields
  //  * NOTE: it's an array of arrays since a selected override could have children that should represent one selected override
  //  */
  private buildSelectedFields(fields: Array<ServiceNowField>,
                              courierConfig: { [key: string]: ServiceNowCourierConfig }): Array<Array<ServiceNowField>> {
    if (fields.length === 0) {
      return [];
    } else {
      return fields
        .filter((field: ServiceNowField): boolean => {
          return Object.keys(courierConfig).includes(field.fieldName);
        })
        .map((field: ServiceNowField): Array<ServiceNowField> => {
          return this.getFlattenedFields(field);
        })
        .filter((arr: Array<ServiceNowField>) => arr != null && arr.length !== 0);
    }
  }

  /**
   * Flatten a field based on it's child
   */
  private getFlattenedFields(field: ServiceNowField): Array<ServiceNowField> {
    if (field.child == null) {
      return [field];
    } else {
      return [field, ...this.getFlattenedFields(field.child)];
    }
  }
}
