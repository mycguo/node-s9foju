import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import DeviceSnmpCredentials from '../../services/device-management-data/interfaces/device-snmp-credentials';
import ProfileSnmpCredentials from '../../services/device-management-data/interfaces/profile-snmp-credentials';
import SnmpCredentialsRequest from '../../services/device-management-data/interfaces/snmp-credentials-request';
import SnmpCredentialsTypesEnum from '../../services/device-management-data/enums/snmp-credentials-types';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import { FormField } from '../../../shared/components/form/form-field/form-field';
import { RadioGroup } from '../../../shared/components/form/radio-group/radio-group';
import { RadioOption } from '../../../shared/components/form/radio-group/radio-option';
import { SelectOption } from '../../../shared/components/form/select/models/select-option';

enum DeviceCredentialsTypeEnum {
  DEFAULT = 'default',
  PROFILE = 'profile',
  SETTINGS = 'settings',
}

@Component({
  selector: 'nx-snmp-credentials-modal',
  templateUrl: './snmp-credentials-modal.component.html',
  styleUrls: ['./snmp-credentials-modal.component.less']
})
export class SnmpCredentialsModalComponent implements OnInit, OnChanges {

  @Input() deviceCredentials: DeviceSnmpCredentials;
  @Input() modalSubtitle: string;
  @Input() isMultipleDevices = false;
  @Input() profiles: ProfileSnmpCredentials[];
  @Input() isLoading: boolean;
  @Input() error: SimpleAlert;
  @Output() cancelClicked = new EventEmitter<void>();
  @Output() submitClicked = new EventEmitter<SnmpCredentialsRequest>();

  readonly DeviceCredentialsTypeEnum = DeviceCredentialsTypeEnum;

  readonly MODAL_CONTROL_KEY = 'modalControlKey';
  readonly SETTINGS_CONTROL_KEY = 'settings';
  readonly PROFILE_CONTROL_KEY = 'id';

  formGroup: FormGroup;
  settingsFormGroup: FormGroup;
  profileFormGroup: FormGroup;

  showContent = false;
  initialized: boolean;

  settingsFormControl: FormControl;
  profileSelectModel: FormField;
  profileSelectOptions: SelectOption[] = [];

  credentialTypeRadioGroupModel: DeviceCredentialsTypeEnum;
  RADIO_GROUP: typeof DeviceCredentialsTypeEnum = DeviceCredentialsTypeEnum;
  radioGroup = {
    [DeviceCredentialsTypeEnum.DEFAULT]: new RadioGroup([new RadioOption(DeviceCredentialsTypeEnum.DEFAULT, 'Keep current settings for all devices')]),
    [DeviceCredentialsTypeEnum.PROFILE]: new RadioGroup([new RadioOption(DeviceCredentialsTypeEnum.PROFILE, 'Сhoose profile from store')]),
    [DeviceCredentialsTypeEnum.SETTINGS]: new RadioGroup([new RadioOption(DeviceCredentialsTypeEnum.SETTINGS, 'Enter SNMP connection settings for this device')])
  };

  constructor(
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({});

    this.settingsFormGroup = this.fb.group({
      [this.SETTINGS_CONTROL_KEY]: this.fb.control(void 0),
    });

    this.profileFormGroup = this.fb.group({
      [this.PROFILE_CONTROL_KEY]: this.fb.control(void 0, [Validators.required]),
    });
  }

  ngOnInit() {
    this.profileSelectModel = {
      label: 'Profile '
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deviceCredentials?.currentValue !== void 0 &&
      !changes.deviceCredentials.isFirstChange() &&
      !changes.deviceCredentials.currentValue.loading
    ) {
      this.credentialTypeRadioGroupModel = this.computeCredentialTypeRadioGroupModel(this.deviceCredentials?.type, this.isMultipleDevices);
      this.computeControls(this.credentialTypeRadioGroupModel);
    }

    if (changes.profiles?.currentValue !== void 0 && !changes.profiles.isFirstChange()) {
      this.profileSelectOptions = this.profiles?.map(profile => new SelectOption(profile.id, profile.profileName)) || [];
    }
  }

  onRadioGroupChange(value: DeviceCredentialsTypeEnum) {
    this.credentialTypeRadioGroupModel = value;
    this.computeControls(value);
  }

  onSubmitClick() {
    if (this.credentialTypeRadioGroupModel === DeviceCredentialsTypeEnum.PROFILE) {
      this.submitClicked.emit({
        type: SnmpCredentialsTypesEnum.PROFILE,
        credential: this.formGroup.get(this.MODAL_CONTROL_KEY).value
      });
    } else {
      this.submitClicked.emit({
        type: SnmpCredentialsTypesEnum.MANUAL,
        credential: this.formGroup.get(this.MODAL_CONTROL_KEY).value[this.SETTINGS_CONTROL_KEY]
      });
    }

    this.showContent = true;
  }

  /**
   * selecting appropriate radio group based on:
   * 1) snmp data source
   * 2) number of selected devices (isMultiple - if two or more devices selected)
   */
  private computeCredentialTypeRadioGroupModel(type: SnmpCredentialsTypesEnum, isMultiple: boolean): DeviceCredentialsTypeEnum {
    if (isMultiple && !this.initialized) {
      this.initialized = true;
      return DeviceCredentialsTypeEnum.DEFAULT;
    }
    return type === SnmpCredentialsTypesEnum.PROFILE ? DeviceCredentialsTypeEnum.PROFILE : DeviceCredentialsTypeEnum.SETTINGS;
  }

  private computeControls(value: DeviceCredentialsTypeEnum): void {
    this.formGroup.removeControl(this.MODAL_CONTROL_KEY);
    if (value === DeviceCredentialsTypeEnum.PROFILE) {
      this.formGroup.registerControl(
        this.MODAL_CONTROL_KEY,
        this.profileFormGroup
      );
      this.formGroup.patchValue({
        [this.MODAL_CONTROL_KEY]: {
          [this.PROFILE_CONTROL_KEY]: this.deviceCredentials.id || null
        }
      });
    } else if (value === DeviceCredentialsTypeEnum.SETTINGS) {
      this.formGroup.registerControl(
        this.MODAL_CONTROL_KEY,
        this.settingsFormGroup
      );
      this.formGroup.patchValue({
        [this.MODAL_CONTROL_KEY]: {
          [this.SETTINGS_CONTROL_KEY]: this.deviceCredentials
        }
      });
    }
    this.formGroup.updateValueAndValidity();
    this.formGroup.markAsPristine();
  }
}
