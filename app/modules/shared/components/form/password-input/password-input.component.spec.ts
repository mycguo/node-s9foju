/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { PasswordInputComponent } from './password-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';

@Component({
  template: `
    <nx-password-input
      [formControl]="formControl"
      [inputModel]="inputModel">
    </nx-password-input>`
})
class PasswordInputHostComponent {
  formControl = new FormControl();
  inputModel = new SimpleInputModel(HtmlInputTypesEnum.password);
}

describe('PasswordInputComponent', () => {
  let fixture: ComponentFixture<PasswordInputHostComponent>;
  let component: PasswordInputComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [
        PasswordInputComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordInputHostComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
