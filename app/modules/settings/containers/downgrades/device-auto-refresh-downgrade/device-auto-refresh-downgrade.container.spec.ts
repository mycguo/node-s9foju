import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAutoRefreshDowngradeContainer } from './device-auto-refresh-downgrade.container';

describe('DeviceAutoRefreshDowngradeContainer', () => {
  let component: DeviceAutoRefreshDowngradeContainer;
  let fixture: ComponentFixture<DeviceAutoRefreshDowngradeContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceAutoRefreshDowngradeContainer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAutoRefreshDowngradeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
