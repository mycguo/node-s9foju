import IntegrationSdwanForm from './integrationsSdwanForm';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BasicIntegrationFormComponent} from '../basic-integration-form/basic-integration-form.component';
import {CommonService} from '../../../../utils/common/common.service';
import IntegrationsSdwanConfig from './integrationsSdwanConfig';

@Component({
  selector: 'nx-sdwan-form',
  templateUrl: './sdwan-form.component.html',
  styleUrls: ['./sdwan-form.component.less']
})
export class SdwanFormComponent implements OnInit, OnChanges {
  private static readonly HEADERS_FG_KEY = 'httpHeaders';

  @Input() sdwanIntegrations: IntegrationsSdwanConfig;
  @Input() isEdit: boolean;
  @Input() isLoading: boolean;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() formSubmit: EventEmitter<IntegrationSdwanForm> = new EventEmitter<IntegrationSdwanForm>();

  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService) {
    this.formGroup = this.fb.group({
      integration: {
        [BasicIntegrationFormComponent.HOSTNAME_KEY]: this.sdwanIntegrations?.hostname || '',
        [BasicIntegrationFormComponent.USERNAME_KEY]: this.sdwanIntegrations?.username || '',
        [BasicIntegrationFormComponent.PASSWORD_KEY]: ''
      },
      [SdwanFormComponent.HEADERS_FG_KEY]: this.sdwanIntegrations?.headers
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.isLoading?.currentValue)) {
      const isLoading: boolean = changes.isLoading.currentValue;
      if (isLoading) {
        // https://github.com/angular/angular/issues/22556#issuecomment-550364339
        this.formGroup.disable({emitEvent: false, onlySelf: true});
        this.formGroup.disable({emitEvent: false, onlySelf: true});
      } else {
        // https://github.com/angular/angular/issues/22556#issuecomment-550364339
        this.formGroup.enable({emitEvent: false, onlySelf: true});
        this.formGroup.enable({emitEvent: false, onlySelf: true});
      }
    }

    if (!this.commonService.isNil(changes?.sdwanIntegrations?.currentValue)) {
      const sdwanIntegrations: IntegrationsSdwanConfig = changes.sdwanIntegrations.currentValue;
      this.formGroup.patchValue({
          integration: {
            [BasicIntegrationFormComponent.HOSTNAME_KEY]: sdwanIntegrations.hostname,
            [BasicIntegrationFormComponent.USERNAME_KEY]: sdwanIntegrations.username
          },
          [SdwanFormComponent.HEADERS_FG_KEY]: sdwanIntegrations.headers
        },
        {emitEvent: false, onlySelf: true});
    }
  }

  get headersKey(): string {
    return SdwanFormComponent.HEADERS_FG_KEY;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const sdwanForm: IntegrationSdwanForm = {
      hostname: this.formGroup.value.integration[BasicIntegrationFormComponent.HOSTNAME_KEY],
      username: this.formGroup.value.integration[BasicIntegrationFormComponent.USERNAME_KEY],
      password: this.formGroup.value.integration[BasicIntegrationFormComponent.PASSWORD_KEY]
    };
    if (!this.commonService.isEmpty(this.formGroup.value[SdwanFormComponent.HEADERS_FG_KEY])) {
      sdwanForm.headers = this.formGroup.value[SdwanFormComponent.HEADERS_FG_KEY];
    }
    this.formSubmit.emit(sdwanForm);
  }
}
