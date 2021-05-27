import { Component, HostBinding, Input, Self } from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {CommonService} from '../../../../../utils/common/common.service';
import {ToggleModel} from './models/toggle.model';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.less']
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() toggleModel: ToggleModel;
  @HostBinding('class.nx-toggle_inline') @Input() inline = true;
  @HostBinding('class.nx-toggle_disable') get disableState() { return this.control?.disabled; }

  id: string;
  inputControl: FormControl;

  onTouch = () => void 0;

  constructor(@Self() public controlDir: NgControl,
              private commonService: CommonService) {
    controlDir.valueAccessor = this;
    this.id = this.commonService.uniqueId('nx-toggle_');
    this.inputControl = new FormControl(false);
  }

  get control(): AbstractControl {
    return this.controlDir.control;
  }

  writeValue(value: boolean): void {
    this.inputControl.patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.inputControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable({emitEvent: false, onlySelf: true}) :
      this.inputControl.enable({emitEvent: false, onlySelf: true});
  }
}
