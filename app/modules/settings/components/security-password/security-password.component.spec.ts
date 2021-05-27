import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPasswordComponent } from './security-password.component';
import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {PasswordOptions} from './interfaces/password-options';
import DetailedError from '../../../shared/components/loading/detailed-error';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'security-password-host',
  template: `
    <nx-security-password
      [isLoading]="isLoading"
      [error]="error"
      [passwordOptions]="passwordOptions"
      ></nx-security-password>
  `
})
class SecurityPasswordHostComponent implements OnInit {
  isLoading = true;
  error: DetailedError;
  passwordOptions: PasswordOptions;

  ngOnInit() {
    this.passwordOptions = {
      minimumRequiredLength: 5,
      requiredUpperCase: 0,
      requiredLowerCase: 0,
      requiredNumeric: 0,
      requiredNonAlphaNumeric: 0,
      passwordLifetime: 60,
      passwordChangeRestrictionPeriod: 0,
      maxStoredPreviousPasswords: 0
    };
    this.isLoading = false;
  }
}

describe('SecurityPasswordComponent', () => {
  let component: SecurityPasswordHostComponent;
  let fixture: ComponentFixture<SecurityPasswordHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [ SecurityPasswordHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPasswordHostComponent);
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
