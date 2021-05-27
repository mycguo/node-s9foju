import {Component, OnDestroy, OnInit, HostBinding, Input, Self} from '@angular/core';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl, ValidationErrors,
  Validators
} from '@angular/forms';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {CommonService} from '../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-basic-integration-form',
  templateUrl: './basic-integration-form.component.html',
  styleUrls: ['./basic-integration-form.component.less'],
})
export class BasicIntegrationFormComponent implements OnInit, OnDestroy, ControlValueAccessor {
  public static readonly HOSTNAME_KEY = 'hostname';
  public static readonly USERNAME_KEY = 'username';
  public static readonly PASSWORD_KEY = 'password';

  @Input() inlineView = false;

  @HostBinding('class.nx-view-row') get isViewInline() {
    return this.inlineView;
  }

  integrationForm: FormGroup;

  hostnameField: SimpleInputModel;
  usernameField: SimpleInputModel;
  passwordField: SimpleInputModel;

  onTouched: () => void;

  constructor(
    @Self() public controlDir: NgControl,
    private fb: FormBuilder,
    private commonService: CommonService,
    private formValidationService: FormValidationService
  ) {
    controlDir.valueAccessor = this;

    this.hostnameField = new SimpleInputModel(HtmlInputTypesEnum.text,
      'Hostname',
      'Hostname');
    this.usernameField = new SimpleInputModel(HtmlInputTypesEnum.text,
      'Username',
      'Username');
    this.passwordField = new SimpleInputModel(HtmlInputTypesEnum.password,
      'Password',
      'Password');

    this.integrationForm = this.fb.group({
      [BasicIntegrationFormComponent.HOSTNAME_KEY]: ['', [Validators.required, this.formValidationService.hostname(true)]],
      [BasicIntegrationFormComponent.USERNAME_KEY]: ['', [Validators.required]],
      [BasicIntegrationFormComponent.PASSWORD_KEY]: ['', [Validators.required]]
    });
  }

  get control() {
    return this.controlDir?.control;
  }

  get staticHostnameKey() {
    return BasicIntegrationFormComponent.HOSTNAME_KEY;
  }

  get staticUsernameKey() {
    return BasicIntegrationFormComponent.USERNAME_KEY;
  }

  get staticPasswordKey() {
    return BasicIntegrationFormComponent.PASSWORD_KEY;
  }

  ngOnInit(): void {
    // explicitly ignoring validators on control
    this.control.setValidators(this.formValidation.bind(this));
    this.control.updateValueAndValidity();
  }

  ngOnDestroy(): void {
  }

  writeValue(value: Object) {
    const validKeys = [
      BasicIntegrationFormComponent.HOSTNAME_KEY,
      BasicIntegrationFormComponent.USERNAME_KEY,
      BasicIntegrationFormComponent.PASSWORD_KEY,
    ];
    const cleanedObject = this.commonService.cleanObject(validKeys, value);
    this.integrationForm.patchValue(cleanedObject, {emitEvent: false});
  }

  registerOnChange(fn): void {
    this.integrationForm.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(fn);
  }

  registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.integrationForm.disable() : this.integrationForm.enable();
  }

  formValidation(c: AbstractControl): ValidationErrors | null {
    return this.integrationForm.valid ? null : {invalidForm: {valid: false}};
  }
}
