import { Component, forwardRef, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SimpleInputModel } from '../form/simple-input/models/simple-input.model';
import { FormField } from '../form/form-field/form-field';
import { SelectOption } from '../form/select/models/select-option';
import HtmlInputTypesEnum from '../form/simple-input/models/html-input-types.enum';
import SnmpVersionsEnum from '../../../device-management/services/device-management-data/enums/snmp-versions';
import SnmpAuthProtocolsEnum from '../../../device-management/services/device-management-data/enums/snmp-auth-protocols';
import SnmpPrivProtocolsEnum from '../../../device-management/services/device-management-data/enums/snmp-priv-protocols';
import DeviceSnmpCredentials from '../../../device-management/services/device-management-data/interfaces/device-snmp-credentials';
import SnmpCredentialsSettings from '../../../device-management/services/device-management-data/interfaces/snmp-credentials-settings';
import { FormValidationService } from '../../../../services/form-validation/form-validation.service';

@UntilDestroy()
@Component({
  selector: 'nx-snmp-credentials',
  templateUrl: './snmp-credentials.component.html',
  styleUrls: ['./snmp-credentials.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SnmpCredentialsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SnmpCredentialsComponent),
      multi: true
    },
  ],
})
export class SnmpCredentialsComponent implements OnInit, ControlValueAccessor, Validator {
  readonly snmpVersionsEnum = SnmpVersionsEnum;
  readonly SNMP_VERSION_CONTROL_KEY = 'snmpVersion';
  readonly PORT_CONTROL_KEY = 'port';

  readonly SETTINGS_CONTROL_KEY = 'settings';
  readonly SNMP_COMMUNITY_CONTROL_KEY = 'snmpCommunity';
  readonly SNMP_SECURITY_NAME_CONTROL_KEY = 'snmpSecurityName';
  readonly SNMP_AUTH_PROROCOL_CONTROL_KEY = 'snmpAuthProtocol';
  readonly SNMP_AUTH_PASS_PHRASE_CONTROL_KEY = 'snmpAuthPassPhrase';
  readonly SNMP_PRIV_PROTOCOL_CONTROL_KEY = 'snmpPrivProtocol';
  readonly SNMP_PRIV_PASS_PHRASE_CONTROL_KEY = 'snmpPrivPassPhrase';

  snmpFormGroup: FormGroup;
  snmpVersion3FormGroup: FormGroup;
  snmpVersion2FormGroup: FormGroup;
  snmpVersionSelectModel: FormField;
  snmpVersionSelectOptions: SelectOption[] = [];
  portInputModel: SimpleInputModel;
  snmpCommunityInputModel: SimpleInputModel;
  snmpSecurityNameInputModel: SimpleInputModel;
  snmpAuthProtocolSelectModel: FormField;
  snmpAuthProtocolSelectOptions: SelectOption[] = [];
  snmpAuthPassPhraseInputModel: SimpleInputModel;
  snmpPrivProtocolSelectModel: FormField;
  snmpPrivProtocolSelectOptions: SelectOption[] = [];
  snmpPrivPassPhraseInputModel: SimpleInputModel;
  snmpVersion: SnmpVersionsEnum;

  _onTouched: () => void;


  private static changeControlValidators<T>(
    control: AbstractControl,
    validators: ValidatorFn[],
    currentValue: T,
    valueToClearValidators: T
  ): void {
    if (currentValue === valueToClearValidators) {
      control.setValidators(null);
    } else {
      control.setValidators(validators);
    }
    control.updateValueAndValidity({ onlySelf: false });
  }

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
  ) {

    this.snmpFormGroup = this.fb.group({
      [this.SNMP_VERSION_CONTROL_KEY]: this.fb.control(SnmpVersionsEnum.V2C, [Validators.required]),
      [this.PORT_CONTROL_KEY]: this.fb.control('', [Validators.required, this.formValidationService.port()]),
    });

    this.snmpVersion3FormGroup = this.fb.group({
      [this.SNMP_SECURITY_NAME_CONTROL_KEY]: this.fb.control('', [Validators.required]),
      [this.SNMP_AUTH_PROROCOL_CONTROL_KEY]: this.fb.control(SnmpAuthProtocolsEnum.NONE, [Validators.required]),
      [this.SNMP_AUTH_PASS_PHRASE_CONTROL_KEY]: this.fb.control('', []),
      [this.SNMP_PRIV_PROTOCOL_CONTROL_KEY]: this.fb.control(SnmpPrivProtocolsEnum.NONE, [Validators.required]),
      [this.SNMP_PRIV_PASS_PHRASE_CONTROL_KEY]: this.fb.control('', []),
    });

    this.snmpVersion2FormGroup = this.fb.group({
      [this.SNMP_COMMUNITY_CONTROL_KEY]: this.fb.control('', [Validators.required])
    });

    this.snmpFormGroup.controls[this.SNMP_VERSION_CONTROL_KEY].valueChanges.subscribe((value: SnmpVersionsEnum) => {
      this.switchForm(value);
      this.snmpVersion = value;
    });

    this.snmpVersion3FormGroup.get(this.SNMP_AUTH_PROROCOL_CONTROL_KEY).valueChanges
      .subscribe((value: SnmpAuthProtocolsEnum) => {
        SnmpCredentialsComponent.changeControlValidators<SnmpAuthProtocolsEnum>(
          this.snmpVersion3FormGroup.get(this.SNMP_AUTH_PASS_PHRASE_CONTROL_KEY),
          [Validators.required],
          value,
          SnmpAuthProtocolsEnum.NONE
        );
      });

    this.snmpVersion3FormGroup.get(this.SNMP_PRIV_PROTOCOL_CONTROL_KEY).valueChanges
      .subscribe((value: SnmpPrivProtocolsEnum) => {
        SnmpCredentialsComponent.changeControlValidators<SnmpPrivProtocolsEnum>(
          this.snmpVersion3FormGroup.get(this.SNMP_PRIV_PASS_PHRASE_CONTROL_KEY),
          [Validators.required],
          value,
          SnmpPrivProtocolsEnum.NONE
        );
      });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.snmpVersionSelectModel = {
      label: 'SNMP Version '
    };
    this.snmpVersionSelectOptions = [
      new SelectOption(SnmpVersionsEnum.V2C, 'Version 2c'),
      new SelectOption(SnmpVersionsEnum.V3, 'Version 3')
    ];
    this.portInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      'Target Port '
    );
    this.snmpCommunityInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Community String '
    );
    this.snmpSecurityNameInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Username '
    );
    this.snmpAuthProtocolSelectModel = {
      label: 'Protocol '
    };
    this.snmpAuthProtocolSelectOptions = [
      new SelectOption(SnmpAuthProtocolsEnum.NONE, 'None'),
      new SelectOption(SnmpAuthProtocolsEnum.MD5, 'MD5'),
      new SelectOption(SnmpAuthProtocolsEnum.SHA, 'SHA')
    ];
    this.snmpAuthPassPhraseInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.password,
      'Password '
    );
    this.snmpPrivProtocolSelectModel = {
      label: 'Protocol '
    };
    this.snmpPrivProtocolSelectOptions = [
      new SelectOption(SnmpPrivProtocolsEnum.NONE, 'None'),
      new SelectOption(SnmpPrivProtocolsEnum.DES, 'DES'),
      new SelectOption(SnmpPrivProtocolsEnum.TRIPLE_DES, '3-DES'),
      new SelectOption(SnmpPrivProtocolsEnum.AES, 'AES 128-bit'),
      new SelectOption(SnmpPrivProtocolsEnum.AES_192, 'AES 192-bit'),
      new SelectOption(SnmpPrivProtocolsEnum.AES_256, 'AES 256-bit'),
    ];
    this.snmpPrivPassPhraseInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.password,
      'Password '
    );
  }

  registerOnChange(fn: any): void {
    this.snmpFormGroup.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: DeviceSnmpCredentials): void {
    if (obj == null) {
      return;
    }
    const isV2C = !obj.snmpVersion || obj.snmpVersion === SnmpVersionsEnum.V2C;
    if (isV2C) {
      this.snmpFormGroup.registerControl(
        this.SETTINGS_CONTROL_KEY,
        this.snmpVersion2FormGroup
      );
    } else {
      this.snmpFormGroup.registerControl(
        this.SETTINGS_CONTROL_KEY,
        this.snmpVersion3FormGroup
      );
    }
    this.snmpFormGroup.patchValue({
      [this.PORT_CONTROL_KEY]: obj.port || 161,
      [this.SNMP_VERSION_CONTROL_KEY]: obj.snmpVersion || SnmpVersionsEnum.V2C,
      [this.SETTINGS_CONTROL_KEY]: this.patchSettings(obj.settings, isV2C),
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.snmpFormGroup.valid ? null : {snmpCredentials: { valid: false }};
  }

  private patchSettings(settings: SnmpCredentialsSettings, isV2C: boolean = false): {[key: string]: string} {
    if (isV2C) {
      return {
        [this.SNMP_COMMUNITY_CONTROL_KEY]: settings?.snmpCommunity
      };
    }
    return {
      [this.SNMP_SECURITY_NAME_CONTROL_KEY]: settings?.snmpSecurityName,
      [this.SNMP_AUTH_PROROCOL_CONTROL_KEY]: settings?.snmpAuthProtocol,
      [this.SNMP_AUTH_PASS_PHRASE_CONTROL_KEY]: settings?.snmpAuthPassPhrase,
      [this.SNMP_PRIV_PROTOCOL_CONTROL_KEY]: settings?.snmpPrivProtocol,
      [this.SNMP_PRIV_PASS_PHRASE_CONTROL_KEY]: settings?.snmpPrivPassPhrase,
    };
  }

  private switchForm(value: SnmpVersionsEnum): void {
    if (value === SnmpVersionsEnum.V2C) {
      this.snmpFormGroup.setControl(
        this.SETTINGS_CONTROL_KEY,
        this.snmpVersion2FormGroup
      );
    } else {
      this.snmpFormGroup.setControl(
        this.SETTINGS_CONTROL_KEY,
        this.snmpVersion3FormGroup
      );
    }
  }
}
