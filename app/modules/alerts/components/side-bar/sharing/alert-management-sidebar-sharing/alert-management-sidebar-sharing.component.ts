import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Self, SimpleChanges} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  ValidationErrors
} from '@angular/forms';
import {CommonService} from '../../../../../../utils/common/common.service';
import {AlertSharing} from '../../../../services/couriers/models/alert-sharing';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AlertSharingConfig} from '../alert-sharing-config';
import {map} from 'rxjs/operators';
import { RadioGroup } from '../../../../../shared/components/form/radio-group/radio-group';
import { RadioOption } from '../../../../../shared/components/form/radio-group/radio-option';
import {CvaUtils} from '../../../../../../utils/cva-utils/cva-utils';

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-sidebar-sharing',
  templateUrl: './alert-management-sidebar-sharing.component.html',
  styleUrls: ['./alert-management-sidebar-sharing.component.less']
})
export class AlertManagementSidebarSharingComponent implements OnInit, ControlValueAccessor {
  @Input() isLoading: boolean;
  @Input() sharingConfig: AlertSharingConfig;
  @Input() hasToggle: boolean;
  @Output() defaultInstanceClicked = new EventEmitter<void>();

  readonly SHARING_CONFIG_KEY = 'useDefaultSharingConfig';
  readonly EMAIL_KEY = 'email';
  readonly SN_KEY = 'service-now';
  readonly SNMP_TRAP_KEY = 'snmp-trap';
  readonly WEB_UI_KEY = 'web-ui';
  readonly SYS_LOG_KEY = 'syslog';

  sharingFormGroup: FormGroup;
  onTouched: () => void;

  configurationRadioModel: RadioGroup;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private commonService: CommonService) {
    controlDir.valueAccessor = this;
    this.sharingFormGroup = this.fb.group({
      [this.SHARING_CONFIG_KEY]: [true],
      [this.EMAIL_KEY]: [],
      [this.SN_KEY]: [],
      [this.SNMP_TRAP_KEY]: [],
      [this.WEB_UI_KEY]: [],
      [this.SYS_LOG_KEY]: []
    });
    this.configurationRadioModel = new RadioGroup([
      new RadioOption(true, 'Default configuration'),
      new RadioOption(false, 'Custom configuration')
    ]);
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  ngOnInit() {
    const validators = this.control.validator ?
      [this.control.validator, this.validateFormGroup.bind(this)] :
      this.validateFormGroup.bind(this);
    this.control.setValidators(validators);
  }

  writeValue(obj: AlertSharing): void {
    if (!this.commonService.isNil(obj)) {
      this.sharingFormGroup.patchValue({
        [this.SHARING_CONFIG_KEY]: obj.useDefaultSharingConfig,
        [this.EMAIL_KEY]: obj.email,
        [this.SN_KEY]: obj.serviceNow,
        [this.SNMP_TRAP_KEY]: obj.snmpTrap,
        [this.WEB_UI_KEY]: obj.webUi,
        [this.SYS_LOG_KEY]: obj.syslog
      }, {onlySelf: true, emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this.sharingFormGroup.valueChanges
      .pipe(
        untilDestroyed(this),
        map((): AlertSharing => {
          // use raw value incase items are disabled
          const form = this.sharingFormGroup.getRawValue();
          return {
            useDefaultSharingConfig: form[this.SHARING_CONFIG_KEY],
            email: form[this.EMAIL_KEY],
            serviceNow: form[this.SN_KEY],
            snmpTrap: form[this.SNMP_TRAP_KEY],
            syslog: form[this.SYS_LOG_KEY],
            webUi: form[this.WEB_UI_KEY]
          };
        })
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.sharingFormGroup.disable({emitEvent: false, onlySelf: true}) :
      this.sharingFormGroup.enable({emitEvent: false, onlySelf: true});
  }

  private validateFormGroup(control: AbstractControl): ValidationErrors {
    const errors = CvaUtils.extractControlErrors(this.sharingFormGroup?.controls);
    return this.sharingFormGroup.valid ? null : errors;
  }
}
