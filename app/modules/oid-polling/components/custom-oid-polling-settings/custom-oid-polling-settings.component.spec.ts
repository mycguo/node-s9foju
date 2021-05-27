import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOidPollingSettingsComponent } from './custom-oid-polling-settings.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nx-custom-oid-polling-host-settings',
  template: `
    <form [formGroup]="hostFormGroup">
      <nx-custom-oid-polling-settings
        [parentForm]="settingsFormGroup"
        [formControlName]="generalSettingsControlKey"
      ></nx-custom-oid-polling-settings>
    </form>
  `
})
class CustomOidPollingSettingsHostComponent implements OnInit {
  generalSettingsControlKey = 'general';
  settingsFormGroup: FormGroup;
  hostFormGroup: FormGroup;

  ngOnInit() {
    this.hostFormGroup = new FormGroup({
      [this.generalSettingsControlKey]: new FormControl()
    });

    this.settingsFormGroup = new FormGroup({
      [this.generalSettingsControlKey]: new FormControl({
      name: 'Name',
      oidValue: '.1.2.34',
      processingType: 'DELTA',
      units: 'MHz',
      conversionType: 'DIVIDE',
      conversionFactor: 3
    })
  });
  }
}

describe('CustomOidPollingSettingsComponent', () => {
  let component: CustomOidPollingSettingsHostComponent;
  let fixture: ComponentFixture<CustomOidPollingSettingsHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SharedModule
      ],
      declarations: [CustomOidPollingSettingsHostComponent, CustomOidPollingSettingsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOidPollingSettingsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
