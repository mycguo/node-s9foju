import {Component, forwardRef, OnInit} from '@angular/core';
import {
  ControlValueAccessor, FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {CommonService} from '../../../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServiceNowFieldsService} from '../../../../../integrations/services/service-now-fields/service-now-fields.service';
import {ServiceNowField} from '../../../../../integrations/services/service-now-fields/models/service-now-field';
import ServiceNowCourierConfig from '../../../../../integrations/services/service-now-courier-config/models/service-now-courier-config';
import DetailedError from '../../../../../shared/components/loading/detailed-error';
import {ServiceNowService} from '../../../../../integrations/services/service-now/service-now.service';
import IServiceNowIntegrationsValidate from '../../../../../../../../../project_typings/api/integrations/IServiceNowIntegrationsValidate';
import {SERVICE_NOW_INTEGRATION_TYPE} from '../../../../../../../../../project_typings/enums/serviceNowIntegrationTypeEnum';
import {ServiceNowFieldTypes} from '../../../../../integrations/services/service-now-fields/models/service-now-field-types.enum';
import {AlertManagementSharingService} from '../../../../services/alert-management-sharing/alert-management-sharing.service';

/**
 * https://liveaction.atlassian.net/wiki/spaces/LA/pages/1720025210/9.5.0+ServiceNow+Alert+Override+Frontend+Design
 */
@UntilDestroy()
@Component({
  selector: 'nx-service-now-alert-options-container',
  template: `
    <nx-service-now-alert-options [isLoading]="selectLoading$ | async"
                                  [error]="selectError$ | async"
                                  [formControl]="formControl"
                                  [fields]="fields$ | async"
                                  (blur)="onTouched()"></nx-service-now-alert-options>
  `,
  styles: [':host { display: block }'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceNowAlertOptionsContainer),
      multi: true
    }
  ]
})
export class ServiceNowAlertOptionsContainer implements OnInit, ControlValueAccessor {
  selectLoading$: Observable<boolean>;
  selectError$: Observable<DetailedError>;
  fields$: Observable<Array<ServiceNowField>>;

  formControl: FormControl;
  configs: Array<ServiceNowCourierConfig>;
  onTouched: () => void;
  isDisabled: boolean;

  constructor(private commonService: CommonService,
              private serviceNowService: ServiceNowService,
              private serviceNowFieldsService: ServiceNowFieldsService,
              private alertManagementSharingService: AlertManagementSharingService) {
    this.formControl = new FormControl([]);
    this.configs = [];

    this.selectError$ = combineLatest([
      this.serviceNowFieldsService.selectError(),
      this.serviceNowFieldsService.selectError()
    ]).pipe(
      untilDestroyed(this),
      map((errors: Array<Error>): DetailedError => {
        const filteredErrors = errors.filter((e: Error) => e != null);
        return filteredErrors.length > 0 ? filteredErrors[0] as DetailedError : null;
      })
    );

    this.selectLoading$ = combineLatest([
      this.serviceNowService.selectLoading(),
      this.serviceNowFieldsService.selectLoading(),
    ]).pipe(
      untilDestroyed(this),
      map((loadingStates: Array<boolean>) => {
        return loadingStates.includes(true);
      })
    );

    this.fields$ = this.serviceNowFieldsService.selectFields()
      .pipe(
        map((fields: Array<ServiceNowField>) => {
          return fields.filter((field: ServiceNowField) => field.nxFieldType !== ServiceNowFieldTypes.free_text);
        })
      );
  }

  ngOnInit(): void {
    if (this.serviceNowFieldsService.isEmpty()) {
      this.alertManagementSharingService.getServiceNow().subscribe();
    }
  }

  writeValue(obj: Array<ServiceNowCourierConfig>): void {
    if (!this.commonService.isNil(obj) && !this.commonService.isEmpty(obj) &&
      !this.commonService.isEqual(obj, this.formControl.value)) {
      this.formControl.setValue(obj, {onlySelf: true, emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this.formControl.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable({onlySelf: true, emitEvent: false}) : this.formControl.enable({
      onlySelf: true,
      emitEvent: false
    });
  }
}
