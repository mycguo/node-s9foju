import { FormValidationMessageService } from '../../../../../services/form-validation-message/form-validation-message.service';
import { FormFieldControlDirective } from '../../../directives/form-field-control/form-field-control.directive';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <nx-form-field
      *nxFormFieldControl="let controller from inputFormControl"
      [label]="'Input Label'"
      [prefix]="'>'"
      [postfix]="'s'"
      [hintMessage]="'Hint for input'"
      [isValid]="controller.isValid"
      [isInvalid]="controller.isInvalid"
      [isRequired]="controller.isRequired"
      [isDisabled]="controller.isDisabled"
      [isTouched]="controller.isTouched"
      [errorMessage]="controller.errorMessage"
    >
      <ng-template #inputControl>
        <input class="test-input"
               type="number"
               [formControl]="inputFormControl"
        />
      </ng-template>
    </nx-form-field>
  `
})
class FormFieldHostComponent {
  inputFormControl = new FormControl(null, [Validators.required, Validators.min(1)]);
  isDisabled = false;

  toggleDisabled() {
    if (this.inputFormControl.disabled) {
      this.inputFormControl.enable();
      this.isDisabled = false;
    } else {
      this.inputFormControl.disable();
      this.isDisabled = true;
    }
  }

  getErrorMessage() {
    if (this.inputFormControl.errors && this.inputFormControl.errors.required) {
      return 'Required';
    } else if (this.inputFormControl.errors && this.inputFormControl.errors.min) {
      return 'Must be greater than 0';
    } else {
      return '';
    }
  }
}

describe('FormFieldComponent', () => {
  let component: FormFieldHostComponent;
  let fixture: ComponentFixture<FormFieldHostComponent>;
  let mockFormValidationMessageService;

  beforeEach(waitForAsync(() => {
    mockFormValidationMessageService = jasmine.createSpyObj('FormValidationMessageService', ['getErrorMessage']);
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        FormFieldComponent,
        FormFieldHostComponent,
        FormFieldControlDirective
      ],
      providers: [
        {
          provide: FormValidationMessageService,
          useValue: mockFormValidationMessageService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const inputElement: HTMLElement = fixture.nativeElement;
    expect(component).toBeTruthy();
    expect(inputElement.querySelector('.nx-form-field__header-title').textContent.trim())
      .toEqual('Input Label *');
    expect(inputElement.querySelector('.nx-form-field__body-prefix').textContent.trim())
      .toEqual('>');
    expect(inputElement.querySelector('.nx-form-field__body-postfix').textContent.trim())
      .toEqual('s');
    expect(inputElement.querySelector('input')).toBeDefined();
    expect(inputElement.querySelector('.nx-form-field_is-valid')).toBeDefined();
  });

  it('should be isDisabled', () => {
    const inputElement: HTMLElement = fixture.nativeElement;
    component.toggleDisabled();
    fixture.detectChanges();
    expect(inputElement.querySelector('.nx-form-field-validation-messages__item_type-disable').textContent.trim())
      .toEqual('Hint for input');
    expect(inputElement.querySelector('.nx-form-field_is-disabled')).toBeDefined();
  });

  it('should have error messages', () => {
    mockFormValidationMessageService.getErrorMessage.and.returnValue('Required');
    const inputDe: DebugElement = fixture.debugElement;
    const textInputDe: DebugElement = inputDe.query(By.css('.test-input'));
    textInputDe.nativeElement.value = '';
    textInputDe.nativeElement.dispatchEvent(new Event('input'));
    textInputDe.triggerEventHandler('blur', null);
    fixture.detectChanges();
    const inputElement: HTMLElement = fixture.nativeElement;
    expect(inputElement.querySelector('.nx-form-field_is-invalid')).toBeDefined();
    expect(inputElement.querySelector('.nx-form-field-validation-messages__item').textContent.trim())
      .toEqual(('Required'));

    mockFormValidationMessageService.getErrorMessage.and.returnValue('Must be greater than 0');
    textInputDe.nativeElement.value = 0;
    textInputDe.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputElement.querySelector('.nx-form-field-validation-messages__item').textContent.trim())
      .toEqual(('Must be greater than 0'));
  });

  it('should clear an error message when setting the value through FormControl', () => {
    mockFormValidationMessageService.getErrorMessage.and.returnValue('Required');
    const inputDe: DebugElement = fixture.debugElement;
    const textInputDe: DebugElement = inputDe.query(By.css('.test-input'));
    textInputDe.nativeElement.value = '';
    textInputDe.nativeElement.dispatchEvent(new Event('input'));

    // Cause validation error
    textInputDe.triggerEventHandler('blur', null);
    fixture.detectChanges();
    const inputElement: HTMLElement = fixture.nativeElement;
    expect(inputElement.querySelector('.nx-form-field_is-invalid')).toBeDefined();
    expect(inputElement.querySelector('.nx-form-field-validation-messages__item').textContent.trim())
      .toEqual(('Required'));

    // Set to valid value
    component.inputFormControl.setValue(1);
    fixture.detectChanges();
    expect(inputElement.querySelector(
      '.nx-form-field-validation-messages__item:not(.nx-form-field-validation-messages__item_type-disable)'))
      .toBeNull();
  });
});
