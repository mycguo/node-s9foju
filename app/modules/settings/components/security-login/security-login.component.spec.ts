import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLoginComponent } from './security-login.component';
import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {LoginOptions} from './login-options';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'security-login-host',
  template: `
    <nx-security-login
      [isLoading]="isLoading"
      [error]="error"
      [loginOptions]="loginOptions"
      ></nx-security-login>
  `
})
class SecurityLoginHostComponent implements OnInit {
  isLoading = true;
  error: DetailedError;
  loginOptions: LoginOptions;

  ngOnInit() {
    this.loginOptions = {
      sessionTimeout: 15,
      allowedNumberOfLoginAttempts: 100,
      failedPasswordRestrictionPeriod: 0
    };
    this.isLoading = false;
  }
}

describe('SecurityLoginComponent', () => {
  let component: SecurityLoginHostComponent;
  let fixture: ComponentFixture<SecurityLoginHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [ SecurityLoginHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityLoginHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display no data message', () => {
    const noDataMessageEl: HTMLElement = fixture.nativeElement.querySelector('nx-no-data-message');
    component.error = new DetailedError('error', 'error');
    expect(noDataMessageEl).toBeDefined();
  });
});
