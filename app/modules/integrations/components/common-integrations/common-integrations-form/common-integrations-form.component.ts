import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import IIntegrationForm from '../../../services/integrations-form/IIntegrationForm';
import {FormControl, FormGroup} from '@angular/forms';
import {SimpleInputModel} from '../../../../shared/components/form/simple-input/models/simple-input.model';

@Component({
  selector: 'nx-common-integrations-form',
  templateUrl: './common-integrations-form.component.html',
  styleUrls: ['./common-integrations-form.component.less']
})
export class CommonIntegrationsFormComponent implements OnInit {

  @Input() items: Array<SimpleInputModel> = [];
  @Output() submitForm = new EventEmitter<IIntegrationForm>();
  @Output() cancel = new EventEmitter<void>();

  formControlName = 'default';
  formGroup = new FormGroup((() => {
    const controls = {};
    controls[this.formControlName] = new FormControl();
    return controls;
  })());

  constructor() { }

  ngOnInit() {
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    this.submitForm.emit(this.formGroup.get(this.formControlName).value as IIntegrationForm);
  }
}
