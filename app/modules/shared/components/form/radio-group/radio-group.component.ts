import { Component, HostBinding, Input, OnDestroy, Optional, Self, TemplateRef } from '@angular/core';
import {RadioGroup} from './radio-group';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.less']
})
export class RadioGroupComponent implements OnDestroy, ControlValueAccessor {
  @Input() radioGroup: RadioGroup;
  @Input() groupName: string;
  @Input() contentTpl: TemplateRef<any>;
  @Input() hideContent: boolean;

  @HostBinding('class.nx-radio-group_direction_row') @Input() inline: boolean;
  @HostBinding('class.nx-radio-group_has-background') @Input() hasBackground: boolean;

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

  // ControlValueAccessor interface
  // not implementing b/c we pass control to input
  writeValue(value: string) {
    this.radioControl.patchValue(value, {emitEvent: false});
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
