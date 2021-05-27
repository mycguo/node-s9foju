import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicIntegrationFormComponent} from './basic-integration-form.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SimpleInputComponent} from '../../../shared/components/form/simple-input/simple-input.component';
import {ColComponent} from '../../../shared/components/col/col.component';
import {RowComponent} from '../../../shared/components/row/row.component';
import {FormFieldComponent} from '../../../shared/components/form/form-field/form-field.component';
import {ByteFormattingPipe} from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import {Component} from '@angular/core';

@Component({
  template: `
    <nx-basic-integration-form [formControl]="formControl"></nx-basic-integration-form>`
})
class TestComponent {
  formControl = new FormControl();
}

describe('BasicIntegrationFormComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        BasicIntegrationFormComponent,
        SimpleInputComponent,
        ColComponent,
        RowComponent,
        FormFieldComponent
      ],
      providers: [
        ByteFormattingPipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
