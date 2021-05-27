import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';
import { FilterColumnValues } from './filter-column-values';
import { SelectOption } from '../../shared/components/form/select/models/select-option';

export interface FilterEntity {
  id: LaFilterSupportEnums;
  name: string;
  children?: FilterColumnValues[];
  singleValue?: boolean;
  disableMultipleTags?: boolean;
  selectedOperator?: string;
  operatorOptions?: SelectOption[];
  chipColor?: string;
  groupColor?: string;
}
