import { Component, forwardRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { SimpleInputModel } from '../../../shared/components/form/simple-input/models/simple-input.model';
import { OID_CONVERSION_TYPE_OPTIONS } from '../../constants/oid-conversion-type-options.const';
import { OID_PROCESSING_TYPE_OPTIONS } from '../../constants/oid-processing-type-options.const';
import { ConversionType } from '../../../../services/custom-oids/enums/conversion-type.enum';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import LaRegexpConstant from '../../../../../../../client/laCommon/constants/laRegexp.constant';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProcessingType } from '../../../../services/custom-oids/enums/processing-type.enum';
import { FormValidationService } from '../../../../services/form-validation/form-validation.service';
import { debounceTime, map } from 'rxjs/operators';
import { TOOLTIP_ALIGNMENT_ENUM } from '../../../shared/components/tooltip/enum/tooltip-alignment.enum';
import { BASE_INTEGERS } from '../../../../constants/base-integers.enum';
import { FormField } from '../../../shared/components/form/form-field/form-field';
import { SelectOption } from '../../../shared/components/form/select/models/select-option';

@UntilDestroy()
@Component({
  selector: 'nx-custom-oid-polling-settings',
  templateUrl: './custom-oid-polling-settings.component.html',
  styleUrls: ['./custom-oid-polling-settings.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomOidPollingSettingsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomOidPollingSettingsComponent),
      multi: true
    }
  ]
})
export class CustomOidPollingSettingsComponent implements OnInit, ControlValueAccessor, Validator {

  // Form Elements
  formGroup: FormGroup;

  // Name
  nameControlKey = 'name';
  nameModel: SimpleInputModel;

  // OID Index
  oidValueControlKey = 'oidValue';
  oidValueModel: SimpleInputModel;

  // Processing Type
  processingTypeControlKey = 'processingType';
  processingTypeDisplayModel: FormField;
  processingTypeOptions: Array<SelectOption>;

  // Units
  unitsControlKey = 'units';
  unitsModel: SimpleInputModel;

  // Conversion Type
  conversionTypeControlKey = 'conversionType';
  conversionTypeDisplayModel: FormField;
  conversionTypeOptions: Array<SelectOption>;

  // Conversion Factor
  conversionFactorControlKey = 'conversionFactor';
  conversionFactorModel: SimpleInputModel;

  tooltipAlignment = TOOLTIP_ALIGNMENT_ENUM;

  constructor(
    private formValidationService: FormValidationService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormData();
  }

  private getProcessingType(processingType: ProcessingType): string {
    return OID_PROCESSING_TYPE_OPTIONS.find(option => option.id === processingType)?.id || ProcessingType.NONE;
  }

  private getConversionType(conversionType: ConversionType): string {
    return OID_CONVERSION_TYPE_OPTIONS.find(option => option.id === conversionType)?.id || ConversionType.MULTIPLY;
  }

  private initFormData(): void {

    // Generate form models
    this.nameModel = new SimpleInputModel(HtmlInputTypesEnum.text, 'Name', 'Example: CPU Speed');
    this.oidValueModel = new SimpleInputModel(HtmlInputTypesEnum.text, 'OID Index', 'Example: .1.3.6.1.4.1.232.1.2.2.1.4');
    this.processingTypeDisplayModel = {label: 'Processing Type'};
    this.processingTypeOptions = OID_PROCESSING_TYPE_OPTIONS;
    this.unitsModel = new SimpleInputModel(HtmlInputTypesEnum.text, 'Units', 'Example: MHz');
    this.conversionTypeDisplayModel = {label: 'Conversion Type'};
    this.conversionTypeOptions = OID_CONVERSION_TYPE_OPTIONS;
    this.conversionFactorModel = new SimpleInputModel(HtmlInputTypesEnum.number, 'Conversion Factor');

    // Generate form controls
    this.formGroup = this.fb.group({
      [this.nameControlKey]: [null, Validators.required],
      [this.oidValueControlKey]: [null, [Validators.required, this.formValidationService.oidIndex()]],
      [this.processingTypeControlKey]: [null],
      [this.unitsControlKey]: [null, Validators.required],
      [this.conversionTypeControlKey]: [null],
      [this.conversionFactorControlKey]: [null, [
        Validators.required,
        Validators.pattern(LaRegexpConstant.WHOLE_NUMBERS_PATTERN),
        Validators.min(BASE_INTEGERS.MIN_JAVA_INTEGER),
        Validators.max(BASE_INTEGERS.MAX_JAVA_INTEGER)
      ]]
    }, {emitEvent: false, onlySelf: true});
  }

  private updateFormData(settings: any): void {
    this.formGroup.setValue({
      [this.nameControlKey]: settings?.name || null,
      [this.oidValueControlKey]: settings?.oidValue || null,
      [this.processingTypeControlKey]: this.getProcessingType(settings?.processingType),
      [this.unitsControlKey]: settings?.units || null,
      [this.conversionTypeControlKey]: this.getConversionType(settings?.conversionType),
      [this.conversionFactorControlKey]: settings?.conversionFactor || 1
    }, {emitEvent: false, onlySelf: true});
  }

  writeValue(settings: any): void {
    if (settings !== null) {
      this.updateFormData(settings);
    }
  }

  registerOnChange(fn: (data: any) => void): void {
    this.formGroup.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(200),
        map((form: any): any => {
          return {
            name: form[this.nameControlKey],
            oidValue: form[this.oidValueControlKey],
            processingType: form[this.processingTypeControlKey],
            units: form[this.unitsControlKey],
            conversionType: form[this.conversionTypeControlKey],
            conversionFactor: form[this.conversionFactorControlKey]
          };
        })
      )
      .subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.formGroup.valid ? null : {settings: {valid: false, message: `Settings are invalid`}};
  }

  registerOnTouched(fn: any): void {
  }
}
