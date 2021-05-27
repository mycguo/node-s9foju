import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnmpCredentialsModalComponent } from './snmp-credentials-modal.component';
import { FormBuilder } from '@angular/forms';

describe('SnmpCredentialsModalComponent', () => {
  let component: SnmpCredentialsModalComponent;
  let fixture: ComponentFixture<SnmpCredentialsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnmpCredentialsModalComponent ],
      providers: [FormBuilder],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnmpCredentialsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
