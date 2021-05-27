import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared.module';
import {Component} from '@angular/core';
import {RadioGroup} from '../radio-group/radio-group';
import {RadioOption} from '../radio-group/radio-option';

@Component({
  selector: 'form-radio-group-host',
  template: `
    <nx-form-radio-group [formControl]="control" [radioGroup]="group"></nx-form-radio-group>
  `
})
class FormRadioGroupHostComponent {
  group: RadioGroup;
  control: FormControl;
  constructor() {
    this.group = new RadioGroup([new RadioOption('on', 'On'), new RadioOption('off', 'Off')]);
    this.control = new FormControl();
  }
}

describe('FormRadioGroupComponent', () => {
  let component: FormRadioGroupHostComponent;
  let fixture: ComponentFixture<FormRadioGroupHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [
        FormRadioGroupHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRadioGroupHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
