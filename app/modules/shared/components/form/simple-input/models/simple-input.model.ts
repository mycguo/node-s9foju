import HtmlInputTypesEnum from './html-input-types.enum';
import {FormField} from '../../form-field/form-field';

export class SimpleInputModel implements FormField {
  label: string;
  type: HtmlInputTypesEnum;
  placeholder: string;
  prefix: string;
  postfix: string;
  hintMessage: string;
  errorMessageOverrides: { [p: string]: (args: any) => string };

  constructor(type: HtmlInputTypesEnum,
              label?: string,
              placeholder?: string,
              prefix?: string,
              postfix?: string,
              hintMessage?: string,
              errorMessageOverrides?: { [p: string]: (args: any) => string }) {
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.prefix = prefix;
    this.postfix = postfix;
    this.hintMessage = hintMessage;
    this.errorMessageOverrides = errorMessageOverrides;
  }
}
