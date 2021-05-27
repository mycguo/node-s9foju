import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges, OnDestroy,
  Output, SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import IIntegrationForm from '../../services/integrations-form/IIntegrationForm';
import {BasicIntegrationFormComponent} from '../basic-integration-form/basic-integration-form.component';
import IIntegrations from '../../../../../../../project_typings/api/integrations/IIntegrations';
import {CommonService} from '../../../../utils/common/common.service';

@Component({
  selector: 'nx-apicem-form',
  templateUrl: './apicem-form.component.html',
  styleUrls: ['./apicem-form.component.less']
})
export class ApicemFormComponent implements OnChanges, OnDestroy {
  @Input() apicemIntegrations: IIntegrations;
  @Input() isEdit: boolean;
  @Input() isLoading: boolean;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() formSubmit: EventEmitter<IIntegrationForm> = new EventEmitter<IIntegrationForm>();

  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService) {
    this.formGroup = this.fb.group({
      integration: {
        [BasicIntegrationFormComponent.HOSTNAME_KEY]: '',
        [BasicIntegrationFormComponent.USERNAME_KEY]: '',
        [BasicIntegrationFormComponent.PASSWORD_KEY]: ''
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.isLoading?.currentValue)) {
      const isLoading: boolean = changes.isLoading.currentValue;
      if (isLoading) {
        this.formGroup.disable({emitEvent: false, onlySelf: true});
      } else {
        this.formGroup.enable({emitEvent: false, onlySelf: true});
      }
    }
    if (!this.commonService.isNil(changes?.apicemIntegrations?.currentValue)) {
      const apicemIntegrations: IIntegrations = changes.apicemIntegrations.currentValue;
      this.formGroup.patchValue({
          integration: {
            [BasicIntegrationFormComponent.HOSTNAME_KEY]: apicemIntegrations.hostname,
            [BasicIntegrationFormComponent.USERNAME_KEY]: apicemIntegrations.username
          }
        }, {emitEvent: false, onlySelf: true}
      );
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    this.formSubmit.emit(this.formGroup.get('integration').value as IIntegrationForm);
  }

  ngOnDestroy(): void {
  }
}
