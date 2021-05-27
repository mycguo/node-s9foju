import {FormBuilder, FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import ServiceNowCourierConfig from '../../services/service-now-courier-config/models/service-now-courier-config';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ServiceNowField} from '../../services/service-now-fields/models/service-now-field';
import {SelectInput} from '../../../shared/components/form/select/models/select-input';
import {ServiceNowFieldTypes} from '../../services/service-now-fields/models/service-now-field-types.enum';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {SERVICE_NOW_INTEGRATION_TYPE} from '../../../../../../../project_typings/enums/serviceNowIntegrationTypeEnum';
import {CommonService} from '../../../../utils/common/common.service';

const GLOBAL_SETTINGS_KEY = 'config';
const DESCRIPTION_KEY = 'description';

@Component({
  selector: 'nx-service-now-global-settings',
  templateUrl: './service-now-global-settings.component.html',
  styleUrls: ['./service-now-global-settings.component.less']
})
export class ServiceNowGlobalSettingsComponent implements OnChanges {
  @Input() descriptionValue: string;
  @Input() config: Array<ServiceNowCourierConfig>;
  @Input() fields: Array<ServiceNowField>;
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() integrationType: SERVICE_NOW_INTEGRATION_TYPE;

  @Output() queryOptions = new EventEmitter<string>();
  @Output() saveConfig = new EventEmitter<{ [DESCRIPTION_KEY]: string, [GLOBAL_SETTINGS_KEY]: Array<ServiceNowCourierConfig> }>();

  get staticDescriptionKey(): string {
    return DESCRIPTION_KEY;
  }

  get staticGlobalSettingsKey(): string {
    return GLOBAL_SETTINGS_KEY;
  }

  isIncident: boolean;
  showContent: boolean;
  descriptionInput: SelectInput;
  filteredFields: Array<ServiceNowField>;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private commonService: CommonService) {
    this.descriptionInput = new SelectInput([], 'Send LiveNX alert description to', 'Select ServiceNow field');
    this.filteredFields = [];
    this.formGroup = this.fb.group({
      [this.staticDescriptionKey]: null,
      [this.staticGlobalSettingsKey]: []
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.fields?.currentValue != null) {
      const fields: Array<ServiceNowField> = changes.fields.currentValue;
      this.descriptionInput.options = this.buildDescriptionOptions(changes.fields.currentValue);
      this.filteredFields = this.filterValueFields(fields);
    }
    if (changes?.integrationType?.currentValue != null) {
      const integrationType: SERVICE_NOW_INTEGRATION_TYPE = changes.integrationType.currentValue;
      this.isIncident = integrationType === SERVICE_NOW_INTEGRATION_TYPE.incident;
    }
    if (changes?.isLoading?.currentValue != null) {
      const isLoading: boolean = changes.isLoading.currentValue;
      if (isLoading === false) {
        // once isLoading is false initial data has loaded and content should always be shown
        this.showContent = true;
      }
    }
    if (changes?.descriptionValue?.currentValue != null || changes?.config?.currentValue != null) {
      this.formGroup.enable();
      this.reset();
    }
  }

  /**
   * if empty will reset with items from input
   * will also add/remove controls depending on service now integration type
   */
  reset() {
    if (this.isIncident) {
      if (!this.formGroup.contains(this.staticGlobalSettingsKey)) {
        this.formGroup.addControl(this.staticGlobalSettingsKey, this.fb.control(null));
      }
      this.formGroup.reset({
          [this.staticDescriptionKey]: this.descriptionValue,
          [this.staticGlobalSettingsKey]: this.commonService.cloneDeep(this.config)
        }
      );
    } else {
      if (this.formGroup.contains(this.staticGlobalSettingsKey)) {
        this.formGroup.removeControl(this.staticGlobalSettingsKey);
      }
      this.formGroup.reset({
          [this.staticDescriptionKey]: this.descriptionValue
        }
      );
    }
  }

  onSubmit(): void {
    this.formGroup.disable();
    this.saveConfig.emit(this.formGroup.value);
  }

  /**
   * Filters out free text fields as they are only for description
   */
  private filterValueFields(fields: Array<ServiceNowField>): Array<ServiceNowField> {
    return fields.filter((field: ServiceNowField) => {
      return field.nxFieldType === ServiceNowFieldTypes.drop_down || field.nxFieldType === ServiceNowFieldTypes.reference;
    });
  }

  private buildDescriptionOptions(fields: Array<ServiceNowField>): Array<SelectOption> {
    return fields
      .filter((field: ServiceNowField) => field.nxFieldType === ServiceNowFieldTypes.free_text)
      .map((field: ServiceNowField) => {
        return {
          id: field.fieldName,
          name: field.displayValue
        } as SelectOption;
      });
  }
}
