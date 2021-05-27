import {ServiceNowFieldTypes} from './service-now-field-types.enum';

export interface ServiceNowFieldResponse {
  id?: string; // optional b/c resp doesn't have but store does
  fieldName: string;
  displayValue: string;
  defaultValue: string;
  isDependentOnField: boolean;
  dependentField: string;
  isReference: boolean;
  referenceTableName: string;
  nxFieldType: ServiceNowFieldTypes;
}
