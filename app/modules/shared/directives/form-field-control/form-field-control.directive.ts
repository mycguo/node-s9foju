import {
  AfterContentChecked,
  Directive,

  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {FormValidationMessageService} from '../../../../services/form-validation-message/form-validation-message.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

interface FormFieldControlContext {
  $implicit: {
    isValid: boolean;
    isInvalid: boolean; // need both b/c of async validators
    isTouched: boolean;
    isRequired: boolean;
    isDisabled: boolean;
    errorMessage: string;
  };
}
@UntilDestroy()
@Directive({
  selector: '[nxFormFieldControl]'
})
export class FormFieldControlDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('nxFormFieldControlFrom') control: AbstractControl;
  // tslint:disable-next-line:no-input-rename
  @Input('nxFormFieldControlErrorOverrides') errorOverrides?: { [key: string]: (args: any) => string };
  // tslint:disable-next-line:no-input-rename
  @Input('nxFormFieldControlValidateOnInit') validateOnInit = false;

  context: FormFieldControlContext;

  constructor(
    private tmpl: TemplateRef<FormFieldControlContext>,
    private vcr: ViewContainerRef,
    private formValidationMessage: FormValidationMessageService
  ) {
    this.context = {
      $implicit: {
        isValid: true,
        isInvalid: false,
        isTouched: false,
        isRequired: false,
        isDisabled: false,
        errorMessage: ''
      }
    };
  }

  ngOnInit(): void {
    this.setContext();

    this.vcr.createEmbeddedView(this.tmpl, this.context);
    if (this.control != null) {
      this.control.statusChanges
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.setContext();
        });
    }
  }

  private setContext(): void {
    let isInvalid = !this.control?.pending && this.control.invalid;
    // if validateOnInit is false, isInvalid needs to be touched
    if (!this.validateOnInit) {
      isInvalid = isInvalid && (this.control?.touched || this.control?.dirty);
    }
    this.context.$implicit = {
      isValid: !this.control?.pending && this.control?.valid,
      isInvalid: isInvalid,
      isTouched: this.control?.touched || this.control?.dirty,
      isRequired: this.required,
      isDisabled: this.control?.disabled,
      errorMessage: this.formValidationMessage.getErrorMessage(this.control?.errors, this.errorOverrides)
    };
  }

  private get required(): boolean {
    if (this.control?.validator != null) {
      return this.control.validator({} as AbstractControl)?.required !== void 0;
    }
  }
}
