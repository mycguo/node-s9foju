import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BasicIntegrationFormComponent } from '../basic-integration-form/basic-integration-form.component';
import { CommonService } from '../../../../utils/common/common.service';
import { SimpleInputModel } from '../../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import { FormValidationService } from '../../../../services/form-validation/form-validation.service';

@Component({
  selector: 'nx-livenca-form',
  templateUrl: './livenca-form.component.html',
  styleUrls: ['./livenca-form.component.less']
})
export class LivencaFormComponent implements OnInit, OnChanges {

  @Input() livencaIntegrations: { hostname: string; isStale: boolean };
  @Input() isEdit: boolean;
  @Input() isLoading: boolean;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() formSubmit: EventEmitter<{ hostname: string; }> = new EventEmitter<{ hostname: string; }>();

  formGroup: FormGroup;
  simpleInputModel: SimpleInputModel;
  HOSTNAME_KEY: string = BasicIntegrationFormComponent.HOSTNAME_KEY;
  errorMessageOverrides: { [p: string]: (args: any) => string };

  public formField: SimpleInputModel;

  constructor(private fb: FormBuilder,
              private formValidationService: FormValidationService,
              private commonService: CommonService,
  ) {
    this.errorMessageOverrides = {
      invalidHostname: () => 'Invalid hostname'
    };

    this.formGroup = this.fb.group({
      [this.HOSTNAME_KEY]: [null, [
        Validators.required,
        this.uriValidator()
      ]
      ],
    });
  }

  private initForm(): void {
    this.formField = new SimpleInputModel(
      HtmlInputTypesEnum.url,
      'Hostname',
      'ex.:https://livenca.com/',
      void 0,
      void 0,
      null,
      this.errorMessageOverrides,
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.livencaIntegrations?.currentValue)) {
      const livencaIntegrations: { hostname: string; } = changes.livencaIntegrations.currentValue;
      this.formGroup.reset({
          [BasicIntegrationFormComponent.HOSTNAME_KEY]: livencaIntegrations.hostname,
        },
        {emitEvent: false, onlySelf: true});
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const liveNCAForm: { hostname: string; } = {
      hostname: this.formGroup.value[BasicIntegrationFormComponent.HOSTNAME_KEY],
    };
    this.formSubmit.emit(liveNCAForm);
  }

  uriValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = !(/https?:\/\/\w+\..+/i).test(control.value);
      return forbidden ? {invalidHostname: {value: control.value}} : null;
    };
  }
}


