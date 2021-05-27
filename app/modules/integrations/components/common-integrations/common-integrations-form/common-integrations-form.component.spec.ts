import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIntegrationsFormComponent } from './common-integrations-form.component';
import {IntegrationsModule} from '../../../integrations.module';

describe('CommonIntegrationsFormComponent', () => {
  let component: CommonIntegrationsFormComponent;
  let fixture: ComponentFixture<CommonIntegrationsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IntegrationsModule.forRoot(false)
      ],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonIntegrationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
