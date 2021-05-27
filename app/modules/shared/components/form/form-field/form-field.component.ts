import {
  Component,
  ContentChild,
  HostBinding,
  Input,
  TemplateRef
} from '@angular/core';
import { fadeAnimation } from '../../../../../animations/fade.animation';

@Component({
  selector: 'nx-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: [
    './form-field.component.less',
    '../select/select.component.less'
  ],
  animations: fadeAnimation
})
export class FormFieldComponent {
  @Input() label: string;
  @Input() prefix: string;
  @Input() postfix: string;
  @Input() hintMessage: string;
  @Input() headerAdditionalElements: TemplateRef<any>;

  @Input() isTouched: boolean;
  @Input() isRequired: boolean;
  @Input() errorMessage: string;
  @HostBinding('class.nx-form-field_is-invalid') @Input() isInvalid: boolean;
  @HostBinding('class.nx-form-field_is-valid') @Input() isValid: boolean;
  @HostBinding('class.nx-form-field_is-disabled') @Input() isDisabled: boolean;
  @HostBinding('class.nx-form-field_inline') @Input() inline = false;
  @HostBinding('class.nx-form-field_readonly') @Input() readonly = false;

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  constructor() {
  }
}
