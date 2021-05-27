import {RadioOption} from './radio-option';
import {FormField} from '../form-field/form-field';

export class RadioGroup implements FormField {
  label: string;
  options: Array<RadioOption>;
  prefix: string;  // not used
  postfix: string; // not used
  hintMessage: string;
  errorMessageOverrides: { [p: string]: (args: any) => string };

  constructor(
    options: Array<RadioOption>,
    label?: string,
    hintMessage?: string,
    errorMessageOverrides?: { [p: string]: (args: any) => string }
  ) {
    this.label = label;
    this.options = options;
    this.hintMessage = hintMessage;
    this.errorMessageOverrides = errorMessageOverrides;
  }
}
