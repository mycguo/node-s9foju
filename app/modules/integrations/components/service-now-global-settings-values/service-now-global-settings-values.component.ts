import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Self
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl
} from '@angular/forms';
import {ServiceNowField} from '../../services/service-now-fields/models/service-now-field';
import ServiceNowCourierConfig from '../../services/service-now-courier-config/models/service-now-courier-config';
import {ServiceNowCourierConfigService} from '../../services/service-now-courier-config/service-now-courier-config.service';

@Component({
  selector: 'nx-service-now-global-settings-values',
  templateUrl: './service-now-global-settings-values.component.html',
  styleUrls: ['./service-now-global-settings-values.component.less']
})
export class ServiceNowGlobalSettingsValuesComponent implements OnChanges, ControlValueAccessor {
  @Input() fields: Array<ServiceNowField>;

  flattenedFields: Array<ServiceNowField>;
  courierConfig: { [key: string]: ServiceNowCourierConfig };
  rowsAmount: number;
  isDisabled: boolean;

  onTouched: () => void;
  onChanged: (values: Array<ServiceNowCourierConfig>) => void;

  constructor(@Self() public controlDir: NgControl,
              private serviceNowCourierConfigService: ServiceNowCourierConfigService) {
    controlDir.valueAccessor = this;
    this.courierConfig = {};
    this.rowsAmount = 1;
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.fields?.currentValue != null) {
      this.flattenedFields = this.buildFlattenFields(changes.fields.currentValue);
      this.rowsAmount = Math.ceil(this.flattenedFields.length / 2) ?? 1;
    }
  }

  writeValue(obj: Array<ServiceNowCourierConfig>) {
    if (obj != null) {
      this.courierConfig = this.serviceNowCourierConfigService.transformConfigToObj(obj);
    }
  }

  registerOnChange(fn: (values: Array<ServiceNowCourierConfig>) => void) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  changeHandler(): void {
    this.onChanged(Object.values(this.courierConfig));
  }

  private buildFlattenFields(fields: Array<ServiceNowField>): Array<ServiceNowField> {
    return fields
      .sort(this.sortServiceNowFields)
      .map((field: ServiceNowField) => {
        return this.extractChildFields(field);
      })
      .flat()
      .filter((field: ServiceNowField) => field != null);
  }

  private extractChildFields(field: ServiceNowField): Array<ServiceNowField> {
    if (field.child == null) {
      return [field];
    } else {
      return [field, ...this.extractChildFields(field.child)];
    }
  }

  private sortServiceNowFields(a: ServiceNowField, b: ServiceNowField): number {
    if (a.displayValue === b.displayValue) {
      return 0;
    } else {
      return a.displayValue > b.displayValue ? 1 : -1;
    }
  }
}
