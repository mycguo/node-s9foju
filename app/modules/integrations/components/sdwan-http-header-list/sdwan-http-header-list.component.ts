import {Component, OnDestroy, OnInit, Self} from '@angular/core';
import {SdwanHttpHeader} from '../sdwan-http-header-item/sdwanHttpHeader';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  NgControl,
  ValidationErrors
} from '@angular/forms';
import {SdwanHttpHeaderItemComponent} from '../sdwan-http-header-item/sdwan-http-header-item.component';
import {CommonService} from '../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-sdwan-header-form',
  templateUrl: './sdwan-http-header-list.component.html',
  styleUrls: ['./sdwan-http-header-list.component.less']
})
export class SdwanHttpHeaderListComponent implements OnInit, OnDestroy, ControlValueAccessor {
  formArray = new FormArray([], [this.uniqueValidation]);
  isDisabled: boolean;
  onTouch: () => {};

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private commonService: CommonService) {
    controlDir.valueAccessor = this;
  }

  get control(): AbstractControl {
    return this.controlDir.control;
  }

  formControlItem(ctrl: AbstractControl): FormControl {
    return ctrl as FormControl;
  }

  ngOnInit(): void {
    // explicitly ignoring validators on control
    this.control.setValidators(this.formArrayValidation.bind(this));
    this.control.updateValueAndValidity();
  }

  ngOnDestroy(): void {
  }

  writeValue(obj: Array<SdwanHttpHeader>): void {
    if (!this.commonService.isEmpty(obj) && Array.isArray(obj)) {
      this.formArray.clear();
      obj.forEach((header: SdwanHttpHeader) => {
        this.formArray.push(this.createHeaderControl(header));
      });
    }
  }

  registerOnChange(fn): void {
    this.formArray.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.formArray.controls.forEach((control: AbstractControl) => control.disable({
        emitEvent: false,
        onlySelf: true
      }));
      this.formArray.disable({emitEvent: false, onlySelf: true});
    } else {
      this.formArray.controls.forEach((control: AbstractControl) => control.enable({emitEvent: false, onlySelf: true}));
      this.formArray.enable({emitEvent: false, onlySelf: true});
    }
  }

  createHeaderControl(header: SdwanHttpHeader): FormControl {
    return this.fb.control({
      [SdwanHttpHeaderItemComponent.NAME_KEY]: header.name,
      [SdwanHttpHeaderItemComponent.VALUE_KEY]: header.value,
      [SdwanHttpHeaderItemComponent.BASE64_KEY]: header.base64
    });
  }

  addHeaderControl(): void {
    this.onTouch();
    this.formArray.push(this.createHeaderControl(<SdwanHttpHeader>{name: '', value: '', base64: false}));
  }

  removeHeaderControl(index: number): void {
    this.onTouch();
    this.formArray.removeAt(index);
  }

  formArrayValidation(control: FormArray): ValidationErrors | null {
    return this.formArray.valid ? null : {arrayValid: false};
  }

  /**
   * Ensure name values are unique in form array
   * @param control - form array control
   */
  uniqueValidation(control: FormArray): ValidationErrors | null {
    const names: Array<string> = control.value.map((header: SdwanHttpHeader) => header.name);
    const duplicates: Array<string> = names.filter((name: string, idx: number) => names.indexOf(name) !== idx);
    if (duplicates.length > 0) {
      return {
        uniqueField: duplicates[0]
      };
    }
    return null;
  }
}
