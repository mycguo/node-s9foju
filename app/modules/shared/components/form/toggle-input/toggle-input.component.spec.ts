import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleInputComponent } from './toggle-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { Component } from '@angular/core';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'toggle-input-host',
  template: `
    <nx-toggle-input
      [formControl]="formControl"
      [inputModel]="inputModel"
      [tooltipMsg]="'Some message'">
    </nx-toggle-input>
  `
})
class ToggleInputHostComponent {
  formControl = new FormControl();
  inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.number,
    'Field label',
    void 0,
    void 0,
    'hour(s)'
  );
}

describe('ToggleInputComponent', () => {
  let component: ToggleInputHostComponent;
  let fixture: ComponentFixture<ToggleInputHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [ToggleInputHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleInputHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change value', () => {
    expect(component.formControl.value).toBeNull();
    component.formControl.setValue('10');
    fixture.detectChanges();
    expect(component.formControl.value).toEqual('10');
  });

  it('should set invalid state on empty input', () => {
    expect(component.formControl.value).toBeNull();
    component.formControl.setValue('');
    const toggleInput = fixture.debugElement.nativeElement;
    const checkbox = toggleInput.querySelector('.nx-checkbox');
    checkbox.click();
    fixture.detectChanges();
    expect(component.formControl.invalid).toBeTruthy();
  });

  it('should disable input on uncheck checkbox', () => {
    const toggleInput = fixture.debugElement.nativeElement;
    const checkbox = toggleInput.querySelector('.nx-checkbox');
    checkbox.click();
    fixture.detectChanges();
    expect(toggleInput.querySelector('.nx-form-field_is-disabled')).toBeDefined();
  });
});
