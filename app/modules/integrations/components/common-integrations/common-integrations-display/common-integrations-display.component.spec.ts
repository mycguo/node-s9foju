import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIntegrationsDisplayComponent } from './common-integrations-display.component';
import {IntegrationsModule} from '../../../integrations.module';

describe('CommonIntegrationsDisplayComponent', () => {
  let component: CommonIntegrationsDisplayComponent;
  let fixture: ComponentFixture<CommonIntegrationsDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IntegrationsModule
      ],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonIntegrationsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
