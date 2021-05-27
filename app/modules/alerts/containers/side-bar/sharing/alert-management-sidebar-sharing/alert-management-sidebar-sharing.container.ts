import {Component, EventEmitter, Input, OnInit, Output, Self} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AlertSharingConfig} from '../../../../components/side-bar/sharing/alert-sharing-config';
import {ServiceNowService} from '../../../../../integrations/services/service-now/service-now.service';
import {EmailConfigurationService} from '../../../../../../services/email-configuration/email-configuration.service';
import {CouriersService} from '../../../../services/couriers/couriers.service';
import {SyslogService} from '../../../../../../services/syslog/syslog.service';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NgControl,
  ValidationErrors
} from '@angular/forms';
import {AlertSharing} from '../../../../services/couriers/models/alert-sharing';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AlertManagementSharingService} from '../../../../services/alert-management-sharing/alert-management-sharing.service';
import {CvaUtils} from '../../../../../../utils/cva-utils/cva-utils';

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-sidebar-sharing-container',
  template: `
    <!-- isLoading should only be true when the form is enabled (not in saving process)-->
    <nx-alert-management-sidebar-sharing
      [formControl]="formControl"
      [isLoading]="(isLoading$ | async) && formControl.enabled"
      [sharingConfig]="sharingConfig$ | async"
      [hasToggle]="hasToggle"
      (blur)="onTouched()"
      (defaultInstanceClicked)="defaultInstanceClicked.emit()">
    </nx-alert-management-sidebar-sharing>
  `,
  styles: []
})
export class AlertManagementSidebarSharingContainer implements OnInit, ControlValueAccessor {
  @Input() hasToggle: boolean;
  @Output() defaultInstanceClicked = new EventEmitter<void>();

  isLoading$: Observable<boolean>;
  sharingConfig$: Observable<AlertSharingConfig>;

  formControl: FormControl;
  onTouched: () => void;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private alertManagementSharingService: AlertManagementSharingService,
              private emailConfigurationService: EmailConfigurationService,
              private serviceNowService: ServiceNowService,
              private couriersService: CouriersService,
              private syslogService: SyslogService) {
    controlDir.valueAccessor = this;
    this.formControl = this.fb.control(null);
    this.isLoading$ = combineLatest([
      this.emailConfigurationService.selectLoading(),
      this.serviceNowService.selectLoading(),
      this.couriersService.selectLoading(),
      this.syslogService.selectLoading()
    ]).pipe(
      map((loadings: Array<boolean>) => loadings.some((loading: boolean) => loading))
    );

    this.sharingConfig$ = combineLatest([
      this.emailConfigurationService.selectIsConfigured(),
      this.serviceNowService.selectIsConfigured(),
      this.couriersService.selectIsSnmpTrapConfigured(),
      this.syslogService.selectIsConfigured()
    ]).pipe(
      map(([isEmailConfigured, isSNConfigured, isSnmpTrapConfigured, isSyslogConfigured]:
             [boolean, boolean, boolean, boolean]) => {
        return {
          email: isEmailConfigured,
          serviceNow: isSNConfigured,
          snmpTrap: isSnmpTrapConfigured,
          syslog: isSyslogConfigured
        } as AlertSharingConfig;
      })
    );
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  ngOnInit(): void {
    this.alertManagementSharingService.getSharingConfiguration()
      .pipe(take(1))
      .subscribe();
    const validators = this.control.validator ?
      [this.control.validator, this.validateFormGroup.bind(this)] :
      this.validateFormGroup.bind(this);
    this.control.setValidators(validators);
  }

  writeValue(obj: AlertSharing): void {
    this.formControl.setValue(obj, {emitEvent: false, onlySelf: true});
  }

  registerOnChange(fn: any): void {
    this.formControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable({emitEvent: false, onlySelf: true}) :
      this.formControl.enable({emitEvent: false, onlySelf: true});
  }

  private validateFormGroup(control: AbstractControl): ValidationErrors {
    return this.formControl.valid ? null : this.formControl.errors;
  }
}
