import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WebUiSharingComponent } from './web-ui-sharing.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '../../../../alerts.module';
import { Component } from '@angular/core';

@Component({
  template: `
    <nx-web-ui-sharing [formControl]="formControl"></nx-web-ui-sharing>`
})
class WebUiSharingHostComponent {
  formControl: FormControl = new FormControl();
}

describe('WebUiSharingComponent', () => {
  let component: WebUiSharingHostComponent;
  let fixture: ComponentFixture<WebUiSharingHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AlertsModule
      ],
      declarations: [
        WebUiSharingComponent,
        WebUiSharingHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebUiSharingHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
