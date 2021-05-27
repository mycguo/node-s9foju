import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCurrentFlowsTabComponent } from './device-current-flows-tab.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('DeviceCurrentFlowsTabComponent', () => {
  let component: DeviceCurrentFlowsTabComponent;
  let fixture: ComponentFixture<DeviceCurrentFlowsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ DeviceCurrentFlowsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceCurrentFlowsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
