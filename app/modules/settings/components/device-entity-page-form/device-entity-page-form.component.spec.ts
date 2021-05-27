import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceEntityPageFormComponent } from './device-entity-page-form.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Component } from '@angular/core';
import {SimpleInputComponent} from '../../../shared/components/form/simple-input/simple-input.component';
import {FormFieldComponent} from '../../../shared/components/form/form-field/form-field.component';
import {FormFieldControlDirective} from '../../../shared/directives/form-field-control/form-field-control.directive';
import {ByteFormattingPipe} from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';

@Component({
  template: `
    <nx-device-entity-page-form [formControl]="formControl"></nx-device-entity-page-form>`
})
class DeviceEntityPageFormHostComponent {
  formControl: FormControl = new FormControl();
}

describe('DeviceEntityPageFormComponent', () => {
  let component: DeviceEntityPageFormHostComponent;
  let fixture: ComponentFixture<DeviceEntityPageFormHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        ByteFormattingPipe
      ],
      declarations: [
        DeviceEntityPageFormComponent,
        DeviceEntityPageFormHostComponent,
        SimpleInputComponent,
        FormFieldComponent,
        FormFieldControlDirective
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceEntityPageFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
