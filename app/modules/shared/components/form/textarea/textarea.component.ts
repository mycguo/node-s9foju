import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input, OnDestroy, Self } from '@angular/core';
import {SimpleInputModel} from '../simple-input/models/simple-input.model';

@UntilDestroy()
@Component({
  selector: 'nx-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.less']
})
export class TextareaComponent implements OnDestroy, ControlValueAccessor {

  /**
   * Set the max count of the rows; should be more than 0.
   * If this value lower then minRows, the styles will be overwritten by the view of the "minRows" mode)
   */
  @Input() maxRows = 1;

  /** Set the min count of the rows; should be more than 0. Default is 2. */
  @Input() minRows = 2;
  @Input() inputModel: SimpleInputModel;

  inputControl: FormControl;
  onTouch: () => void;

  constructor(@Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
    this.inputControl = new FormControl();
  }

  ngOnDestroy() {
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
