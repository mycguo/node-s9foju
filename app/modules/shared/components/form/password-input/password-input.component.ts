import { Component, Input, Self, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';

@UntilDestroy()
@Component({
  selector: 'nx-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.less']
})
export class PasswordInputComponent implements ControlValueAccessor {

  @Input() inputModel: SimpleInputModel;
  @Input() validateOnInit = false; // if validation should be run when pristine
  @Input() headerAdditionalElements: TemplateRef<any>;

  inputControl: FormControl;
  onTouch: () => void;
  INPUT_TYPES = HtmlInputTypesEnum;

  constructor(@Self() private controlDir: NgControl) {
    controlDir.valueAccessor = this;
    this.inputControl = new FormControl();
  }

  get control() {
    return this.controlDir.control;
  }

  writeValue(value: string) {
    this.inputControl.patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn): void {
    this.inputControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable({emitEvent: false, onlySelf: true}) :
      this.inputControl.enable({emitEvent: false, onlySelf: true});
  }

}
