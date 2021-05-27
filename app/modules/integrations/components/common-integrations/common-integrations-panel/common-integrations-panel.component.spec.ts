import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIntegrationsPanelComponent } from './common-integrations-panel.component';
import {IntegrationsModule} from '../../../integrations.module';

describe('CommonIntegrationsPanelComponent', () => {
  let component: CommonIntegrationsPanelComponent<any>;
  let fixture: ComponentFixture<CommonIntegrationsPanelComponent<any>>;

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
    fixture = TestBed.createComponent(CommonIntegrationsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
