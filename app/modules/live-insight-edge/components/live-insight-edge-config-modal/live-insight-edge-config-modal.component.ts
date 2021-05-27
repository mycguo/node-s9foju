import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import AnalyticsPlatformModel from '../../../integrations/components/analytics-platform/analytics-platform.model';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import {SPINNER_SIZE} from '../../../shared/components/spinner/spinnerSize';
import AnalyticsPlatformConfig from '../../../../services/analytics-platform/config/analytics-platform-config';

@Component({
  selector: 'nx-live-insight-edge-config-modal',
  templateUrl: './live-insight-edge-config-modal.component.html',
  styleUrls: ['./live-insight-edge-config-modal.component.less']
})
export class LiveInsightEdgeConfigModalComponent implements OnInit, OnChanges {
  static readonly HOSTNAME_KEY = 'hostname';
  static readonly PORT_KEY = 'port';
  static readonly API_INPUT_KEY = 'authToken';

  @Input() configSubmitIsLoading: boolean;
  @Input() configData: AnalyticsPlatformModel;
  @Input() errorMessage: SimpleAlert;
  @Input() checkingConfigConnection: boolean;

  @Output() cancelConfigModalClick = new EventEmitter<void>();
  @Output() submitConfigClick = new EventEmitter<any>();

  formGroup: FormGroup;
  hostnameField: SimpleInputModel;
  portField: SimpleInputModel;
  apiKeyField: SimpleInputModel;

  SPINNER_SIZE = SPINNER_SIZE;

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService
  ) {
  }

  get staticHostnameKey(): string {
    return LiveInsightEdgeConfigModalComponent.HOSTNAME_KEY;
  }

  get staticPortKey(): string {
    return LiveInsightEdgeConfigModalComponent.PORT_KEY;
  }

  get staticApiInputKey(): string {
    return LiveInsightEdgeConfigModalComponent.API_INPUT_KEY;
  }

  ngOnInit() {
    const formData = this.configData || new AnalyticsPlatformModel();
    this.formGroup = this.fb.group({
      [this.staticHostnameKey]: [formData.hostname, [Validators.required, this.formValidationService.hostname]],
      [this.staticPortKey]: [formData.port, [Validators.required, Validators.maxLength(5)]],
      [this.staticApiInputKey]: [formData.authToken, [Validators.required]]
    });

    this.hostnameField = new SimpleInputModel(HtmlInputTypesEnum.text,
      'Hostname',
      'Hostname');
    this.portField = new SimpleInputModel(HtmlInputTypesEnum.number,
      'Port',
      AnalyticsPlatformConfig.DEFAULT_PORT.toString());
    this.apiKeyField = new SimpleInputModel(HtmlInputTypesEnum.text,
      'API Key',
      'API Key');
  }

  handleSubmitForm() {
    this.submitConfigClick.emit(this.formGroup.value);
  }

  handleCancel() {
    this.cancelConfigModalClick.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.configData != null && this.formGroup != null) {
      this.formGroup.patchValue(this.configData);
    }
  }

}
