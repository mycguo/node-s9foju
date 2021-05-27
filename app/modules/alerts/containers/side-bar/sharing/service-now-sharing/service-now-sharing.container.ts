import {Component, Input, OnInit, Self} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NgControl,
  ValidationErrors
} from '@angular/forms';
import {ServiceNowCourier} from '../../../../services/couriers/models/service-now-courier';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ServiceNowService} from '../../../../../integrations/services/service-now/service-now.service';
import {combineLatest, Observable} from 'rxjs';
import {SERVICE_NOW_INTEGRATION_TYPE} from '../../../../../../../../../project_typings/enums/serviceNowIntegrationTypeEnum';
import {map} from 'rxjs/operators';
import IServiceNowIntegrationsValidate from '../../../../../../../../../project_typings/api/integrations/IServiceNowIntegrationsValidate';
import DetailedError from '../../../../../shared/components/loading/detailed-error';

@UntilDestroy()
@Component({
  selector: 'nx-service-now-sharing-container',
  template: `
    <nx-service-now-sharing
      [isLoading]="isLoading$ | async"
      [isIncidentType]="isIncidentType$ | async"
      [isConfigured]="isConfigured"
      [formControl]="serviceNowControl"
      (blur)="onTouched()">
    </nx-service-now-sharing>
  `,
  styles: []
})
export class ServiceNowSharingContainer implements ControlValueAccessor, OnInit {
  @Input() isConfigured: boolean;

  isLoading$: Observable<boolean>;
  isIncidentType$: Observable<boolean>;

  serviceNowControl: FormControl;
  onTouched: () => void;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private serviceNowService: ServiceNowService) {
    controlDir.valueAccessor = this;
    this.serviceNowControl = this.fb.control(null);
    this.isLoading$ = this.serviceNowService.selectLoading();
    this.isIncidentType$ = combineLatest([
      this.serviceNowService.selectServiceNow(),
      this.serviceNowService.selectError()
    ]).pipe(
      map(([serviceNowConfig, err]: [IServiceNowIntegrationsValidate, DetailedError]) => {
        return err == null && serviceNowConfig?.config?.integrationType === SERVICE_NOW_INTEGRATION_TYPE.incident;
      })
    );
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  ngOnInit(): void {
    const validators = this.control.validator ?
      [this.control.validator, this.validateFormGroup.bind(this)] :
      this.validateFormGroup.bind(this);
    this.control.setValidators(validators);

    if (!this.serviceNowService.isConfigurationKnown()) {
      this.serviceNowService.getServiceNow();
    }
  }

  writeValue(obj: ServiceNowCourier) {
    if (obj != null) {
      this.serviceNowControl.setValue(obj, {onlySelf: true, emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this.serviceNowControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ?
      this.serviceNowControl.disable({onlySelf: true, emitEvent: false}) :
      this.serviceNowControl.enable({onlySelf: true, emitEvent: false});
  }

  private validateFormGroup(control: AbstractControl): ValidationErrors {
    return this.serviceNowControl.valid ? null : this.serviceNowControl.errors;
  }
}
