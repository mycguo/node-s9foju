import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { EmailSharingComponent } from './email-sharing.component';

@Component({
  template: `<nx-email-sharing [formControl]="formControl"></nx-email-sharing>`
})
class EmailSharingHostComponent {
  formControl: FormControl = new FormControl();
}

describe('EmailSharingComponent', () => {
  let component: EmailSharingComponent;
  let fixture: ComponentFixture<EmailSharingHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ReactiveFormsModule
      ],
      declarations: [
        EmailSharingComponent,
        EmailSharingHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSharingHostComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
