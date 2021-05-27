import { SelectOption } from './../../../modules/shared/components/form/select/models/select-option';

export default interface SelectDowngradeState {
  options: Array<SelectOption>;
  value: string;
  placeholder?: string;
  required?: boolean;
}
