import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLogoConfigurationDowngradeContainer } from './custom-logo-configuration-downgrade.container';

describe('CustomLogoConfigurationDowngradeContainer', () => {
  let component: CustomLogoConfigurationDowngradeContainer;
  let fixture: ComponentFixture<CustomLogoConfigurationDowngradeContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLogoConfigurationDowngradeContainer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLogoConfigurationDowngradeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
