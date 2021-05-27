import {SelectOption} from '../../../../shared/components/form/select/models/select-option';

export interface SelectFilterParams {
  filterValue?: string | number | boolean;
  options: Array<SelectOption>;
}
