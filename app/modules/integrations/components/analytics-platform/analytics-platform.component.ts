import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren} from '@angular/core';
import { StatusIndicatorValues } from '../../../shared/components/status-indicator/enums/status-indicator-values.enum';
import IIntegrationsDisplay from '../integrations-display/IIntegrationsDisplay';
import {ButtonModel} from '../../../shared/components/button/button.model';
import {KeyValueListItemDirective} from '../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';
import AnalyticsPlatformModel from './analytics-platform.model';
import {RequestErrors} from '../../../../utils/api/request-errors';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import {SIMPLE_ALERT_TYPE_ENUM} from '../../../shared/components/simple-alert/model/simple-alert-type.enum';
import RequestType from '../../../../utils/api/request-type.enum';
import {SPINNER_SIZE} from '../../../shared/components/spinner/spinnerSize';
import {CommonService} from '../../../../utils/common/common.service';
import DetailedError from '../../../shared/components/loading/detailed-error';

@Component({
  selector: 'nx-analytics-platform',
  templateUrl: './analytics-platform.component.html',
  styleUrls: ['./analytics-platform.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsPlatformComponent implements OnInit, OnChanges {

  @Input() state: IntegrationDisplayStateEnum = IntegrationDisplayStateEnum.VIEW;
  @Input() data: AnalyticsPlatformModel = new AnalyticsPlatformModel();
  @Input() configErrors: RequestErrors;
  @Input() connectionErrors: RequestErrors;
  @Input() isLoading: boolean;
  @Input() isCheckingConnection: boolean;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() submitForm = new EventEmitter<AnalyticsPlatformModel>();
  @Output() cancel = new EventEmitter();
  @Output() checkConnection = new EventEmitter();

  @ViewChildren(KeyValueListItemDirective) keyValueListItems;

  actionButtonModels: Array<ButtonModel>;
  formInputs: Array<SimpleInputModel>;
  integrationData: Array<IIntegrationsDisplay> = [];
  alertMessages: SimpleAlert;
  getErrorMessage;
  status = StatusIndicatorValues.UNKNOWN;
  SPINNER_SIZE = SPINNER_SIZE;

  constructor(
    private formValidationService: FormValidationService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.actionButtonModels = this.createActionButtonModels();
    // this.formInputs = this.createFormInputs(this.data);
    this.integrationData = this.createIntegrationData(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data !== void 0) {
      this.integrationData = this.createIntegrationData(this.data);
      this.status = this.data.status;
    }
    if (changes.isLoading !== void 0) {
    }
    if (!this.commonService.isNil(changes.configErrors) && changes.configErrors.previousValue !== this.configErrors) {
      if (RequestType.GET === this.configErrors?.requestType) {
        this.getErrorMessage = new DetailedError(this.configErrors?.errorMessage, null);
      } else {
        this.alertMessages = this.configErrors !== void 0 ? new SimpleAlert('Error', this.configErrors?.errorMessage,
          SIMPLE_ALERT_TYPE_ENUM.ERROR, 5000) : void 0;
      }
    }
    if (changes.connectionErrors !== void 0 && changes.connectionErrors.previousValue !== this.connectionErrors) {
      this.alertMessages = new SimpleAlert('Error', this.connectionErrors?.errorMessage, SIMPLE_ALERT_TYPE_ENUM.ERROR, 5000);
    }
  }

  createActionButtonModels(): Array<ButtonModel> {
    return [
      <ButtonModel> {
        label: 'Check Connection',
        onClick: () => {
          this.checkConnection.emit();
        },
        isPrimary: true
      },
    ];
  }

  createIntegrationData(data: AnalyticsPlatformModel): Array<IIntegrationsDisplay> {
    const formData = data || new AnalyticsPlatformModel();
    return [
      <IIntegrationsDisplay> { name: 'Hostname', value: formData.hostname || '-' },
      <IIntegrationsDisplay> { name: 'Port', value: formData.port ? data.port.toString() : '-' },
    ];
  }
}
