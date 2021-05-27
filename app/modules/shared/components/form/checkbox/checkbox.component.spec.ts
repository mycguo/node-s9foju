import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Component } from "@angular/core";
import { CheckboxComponent } from "./checkbox.component";

const label = 'Label';
@Component({
  template: `
    <nx-checkbox [formControl]="formCtrl" [label]="label"></nx-checkbox>
  `
})
class NxCheckboxHostComponent {
  formCtrl = new FormControl(false);
  label = label;
  partial = false;
}

describe('NxCheckboxComponent', () => {
  let component: NxCheckboxHostComponent;
  let fixture: ComponentFixture<NxCheckboxHostComponent>;
  let element;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ CheckboxComponent, NxCheckboxHostComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NxCheckboxHostComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(element.querySelector('.nx-checkbox__input')).toBeDefined('No input element founded.');
  });

  it('should change the value', () => {
    component.formCtrl.setValue(true);
    fixture.detectChanges();
    expect(element.querySelector('.nx-checkbox__input:checked')).toBeDefined('Checkbox is not selected.');

    component.formCtrl.setValue(false);
    fixture.detectChanges();
    expect(element.querySelector('.nx-checkbox__input:checked')).toBeFalsy('Checkbox is not deselected.');
  });

  it('should set the label', () => {
    expect(element.querySelector('.nx-checkbox__label').innerHTML).toEqual(label, `Label text is not equal: ${label}`);
  });

  it('should disable the checkbox', () => {
    component.formCtrl.disable();
    fixture.detectChanges();
    expect(element.querySelector('.nx-checkbox__input:disabled')).toBeDefined('Checkbox is not disabled.');
  });

  it('should show partial view mode', () => {
    component.partial = true;
    component.formCtrl.setValue(null);
    fixture.detectChanges();
    expect(element.querySelector('.nx-checkbox_partial')).toBeDefined('Partial mode is not activated.');

    component.formCtrl.setValue(true);
    fixture.detectChanges();
    expect(element.querySelector('.nx-checkbox_partial')).toBeFalsy('Partial mode should not be activated, because checkbox is selected.');

    component.formCtrl.setValue(false);
    fixture.detectChanges();
    expect(element.querySelector('.nx-checkbox_partial')).toBeFalsy('Partial mode should not be activated, because form control value is not equal null.');
  });
});
