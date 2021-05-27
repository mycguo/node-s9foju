import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Component, Input, OnChanges, OnInit, Self, SimpleChanges} from '@angular/core';
import {SimpleInputModel} from 'src/app/modules/shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from 'src/app/modules/shared/components/form/simple-input/models/html-input-types.enum';
import {RadioGroup} from 'src/app/modules/shared/components/form/radio-group/radio-group';
import {RadioOption} from 'src/app/modules/shared/components/form/radio-group/radio-option';
import SdwanHttpHeaderTypeEnum from './sdwan-http-header-type.enum';
import {SdwanHttpHeaderControl} from './sdwanHeaderControl';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {CommonService} from '../../../../utils/common/common.service';
import {SdwanHttpHeader} from './sdwanHttpHeader';

@UntilDestroy()
@Component({
  selector: 'nx-sdwan-http-header-item',
  templateUrl: './sdwan-http-header-item.component.html',
  styleUrls: ['./sdwan-http-header-item.component.less']
})
export class SdwanHttpHeaderItemComponent implements OnInit, OnChanges, ControlValueAccessor {

  static readonly NAME_KEY = 'name';
  static readonly VALUE_KEY = 'value';
  static readonly BASE64_KEY = 'base64';

  @Input() radioGroupName: string;
  @Input() parentValidationErrors: ValidationErrors;

  nameInputModel: SimpleInputModel;
  valueInputModel: SimpleInputModel;
  radioGroup: RadioGroup;
  headerForm: FormGroup;

  onTouch: () => {};

  constructor(
    @Self() public controlDir: NgControl,
    private fb: FormBuilder,
    private commonService: CommonService) {
    controlDir.valueAccessor = this;

    this.nameInputModel = new SimpleInputModel(HtmlInputTypesEnum.text, 'Key', 'Header');
    this.valueInputModel = new SimpleInputModel(HtmlInputTypesEnum.text, 'Value', 'Value');
    this.radioGroup = new RadioGroup([
      new RadioOption(SdwanHttpHeaderTypeEnum.PLAIN, 'Plain Text'),
      new RadioOption(SdwanHttpHeaderTypeEnum.BASE64, 'Base64')
    ]);

    this.headerForm = this.fb.group({
      [SdwanHttpHeaderItemComponent.NAME_KEY]: ['', Validators.required],
      [SdwanHttpHeaderItemComponent.VALUE_KEY]: ['', Validators.required],
      [SdwanHttpHeaderItemComponent.BASE64_KEY]: [SdwanHttpHeaderTypeEnum.PLAIN, Validators.required]
    });
  }

  ngOnInit(): void {
    // set validator of formGroup
    // also include any validation already on the control
    if (!this.commonService.isNil(this.control?.validator)) {
      this.control.setValidators([this.formGroupValidation.bind(this), this.control.validator]);
    } else {
      this.control.setValidators(this.formGroupValidation.bind(this));
    }
    this.control.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if parentValidationErrors has uniqueField property
    if (!this.commonService.isNil(changes?.parentValidationErrors)) {
      // if the property value matches the name field then show the error
      if (changes.parentValidationErrors?.currentValue?.uniqueField ===
        this.headerForm.get([SdwanHttpHeaderItemComponent.NAME_KEY]).value) {
        this.headerForm.get([SdwanHttpHeaderItemComponent.NAME_KEY]).setErrors(
          {uniqueField: changes.parentValidationErrors.currentValue.uniqueField}
        );
      } else {
        // remove unique error, but not other errors
        let existingErrors: ValidationErrors | null = this.headerForm.get([SdwanHttpHeaderItemComponent.NAME_KEY]).errors;
        if (!this.commonService.isNil(existingErrors?.uniqueField)) {
          delete existingErrors.uniqueField;
        }
        delete existingErrors?.uniqueField;
        if (this.commonService.isEmpty(existingErrors)) {
          existingErrors = null;
        }
        this.headerForm.get([SdwanHttpHeaderItemComponent.NAME_KEY]).setErrors(existingErrors);
      }
    }
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  get nameKey(): string {
    return SdwanHttpHeaderItemComponent.NAME_KEY;
  }

  get valueKey(): string {
    return SdwanHttpHeaderItemComponent.VALUE_KEY;
  }

  get base64Key(): string {
    return SdwanHttpHeaderItemComponent.BASE64_KEY;
  }

  // Methods of ControlValueAccessor
  writeValue(header: SdwanHttpHeader): void {
    if (!this.commonService.isEmpty(header)) {
      // ensure that only items that match the form group get updated
      const validKeys = [
        SdwanHttpHeaderItemComponent.NAME_KEY,
        SdwanHttpHeaderItemComponent.VALUE_KEY,
        SdwanHttpHeaderItemComponent.BASE64_KEY
      ];

      const validHeader: SdwanHttpHeader = <SdwanHttpHeader>this.commonService.cleanObject(validKeys, header);
      const patchValue = this.transformToControl(validHeader);
      // clean patchValue
      Object.keys(patchValue).forEach((key) => (this.commonService.isNil(key)) && delete patchValue[key]);

      this.headerForm.patchValue(patchValue, {emitEvent: false, onlySelf: true});
    }
  }

  registerOnChange(fn: any): void {
    this.headerForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((header: SdwanHttpHeaderControl) => {
        fn(this.transformToHeader(header));
      });
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.headerForm.disable({emitEvent: false, onlySelf: true}) :
      this.headerForm.enable({emitEvent: false, onlySelf: true});
  }

  formGroupValidation(control: AbstractControl): ValidationErrors | null {
    return !this.headerForm.valid ? {headers: false} : null;
  }

  transformToControl(header: SdwanHttpHeader): SdwanHttpHeaderControl {
    return {
      name: header.name,
      value: header.value,
      base64: header.base64 ? SdwanHttpHeaderTypeEnum.BASE64 : SdwanHttpHeaderTypeEnum.PLAIN
    };
  }

  transformToHeader(controlHeader: SdwanHttpHeaderControl): SdwanHttpHeader {
    return {
      name: controlHeader.name,
      value: controlHeader.value,
      base64: controlHeader.base64 === SdwanHttpHeaderTypeEnum.BASE64
    };
  }
}
