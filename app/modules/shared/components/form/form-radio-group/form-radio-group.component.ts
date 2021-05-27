import {Component, Input, OnDestroy, Optional, Self} from '@angular/core';
import {RadioGroup} from '../radio-group/radio-group';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-form-radio-group',
  templateUrl: './form-radio-group.component.html',
  styleUrls: ['./form-radio-group.component.less']
})
export class FormRadioGroupComponent implements OnDestroy, ControlValueAccessor {
  @Input() radioGroup: RadioGroup;
  @Input() inline: boolean;
  @Input() groupName: string;

  radioControl: FormControl;
  onTouch: () => void;

  constructor(@Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
    this.radioControl = new FormControl();
  }

  ngOnDestroy() {
  }

  get control() {
    return this.controlDir.control;
  }

  writeValue(value: string) {
    this.radioControl.patchValue(value, {emitEvent: false, onlySelf: true});
  }

  registerOnChange(fn): void {
    this.radioControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.radioControl.disable() : this.radioControl.enable();
  }
}
