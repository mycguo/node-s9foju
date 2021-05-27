import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginOptions} from './login-options';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import DetailedError from '../../../shared/components/loading/detailed-error';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {CommonService} from '../../../../utils/common/common.service';

@Component({
  selector: 'nx-security-login',
  templateUrl: './security-login.component.html',
  styleUrls: ['./security-login.component.less']
})
export class SecurityLoginComponent implements OnInit, OnChanges {

  readonly sessionTimeoutKey = 'sessionTimeout';
  readonly allowedNumberOfLoginAttemptsKey = 'allowedNumberOfLoginAttempts';
  readonly failedPasswordRestrictionPeriodKey = 'failedPasswordRestrictionPeriod';

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() loginOptions: LoginOptions;
  @Output() submit = new EventEmitter<LoginOptions>();

  public formGroup: FormGroup;
  public formFields: {[key: string]: SimpleInputModel} = {};

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.initForm(this.loginOptions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.commonService.isNil(changes?.loginOptions?.currentValue) &&
      !changes?.loginOptions?.isFirstChange() &&
      !this.commonService.isEqual(changes?.loginOptions?.currentValue, changes?.loginOptions?.previousValue)
    ) {
      this.formGroup.reset({
        [this.sessionTimeoutKey]: this.loginOptions[this.sessionTimeoutKey] || '',
        [this.allowedNumberOfLoginAttemptsKey]: this.loginOptions[this.allowedNumberOfLoginAttemptsKey] || '',
        [this.failedPasswordRestrictionPeriodKey]: this.loginOptions[this.failedPasswordRestrictionPeriodKey] || '',
      });
    }
  }

  submitChanges() {
    this.submit.emit(this.formGroup.value);
    this.formGroup.markAsPristine();
  }

  private initForm(loginOptions: LoginOptions): void {
    this.formFields[this.sessionTimeoutKey] = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      'Default session timeout',
      void 0,
      void 0,
      'min'
    );

    this.formFields[this.allowedNumberOfLoginAttemptsKey] = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      'Number of failed consecutive login attempts'
    );

    this.formFields[this.failedPasswordRestrictionPeriodKey] = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      'Lock user if number of failed attempts occur in',
      void 0,
      void 0,
      'hour(s)'
    );

    this.formGroup = this.fb.group({
      [this.sessionTimeoutKey]: [loginOptions?.sessionTimeout, [
        Validators.required, Validators.min(1), Validators.max(9999)
      ]],
      [this.allowedNumberOfLoginAttemptsKey]: [loginOptions?.allowedNumberOfLoginAttempts, [
        Validators.required, Validators.min(1), Validators.max(9999)
      ]],
      [this.failedPasswordRestrictionPeriodKey]: [
        loginOptions?.failedPasswordRestrictionPeriod, [Validators.min(1), Validators.max(9999)]
      ]
    });
  }

}
