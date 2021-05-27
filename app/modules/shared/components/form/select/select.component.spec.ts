import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared.module';
import {Component} from '@angular/core';
import {SelectInput} from './models/select-input';
import {SelectOption} from './models/select-option';

@Component({
  template: `
      <nx-select
              [displayModel]="model.displayOptions"
              [options]="model.options"
              [formControl]="formControl"
      ></nx-select>
  `
})
class SelectHostComponent {
  model: SelectInput = new SelectInput(
    [
      new SelectOption(1, 'One'),
      new SelectOption(2, 'Two')
      ]
  );

  formControl: FormControl;

  constructor() {
    this.formControl = new FormControl();
  }
}

describe('SelectComponent', () => {
  let component: SelectHostComponent;
  let fixture: ComponentFixture<SelectHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
      ],
      declarations: [
        SelectHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
