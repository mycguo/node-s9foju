import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeRestrictionSettingComponent } from './time-range-restriction-setting.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TimeRangeRestrictionOption} from './models/time-range-restriction-option';

describe('TimeRangeRestrictionSettingComponent', () => {
  let component: TimeRangeRestrictionSettingComponent;
  let fixture: ComponentFixture<TimeRangeRestrictionSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ TimeRangeRestrictionSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRangeRestrictionSettingComponent);
    component = fixture.componentInstance;
    const timeRangeRestrictionOptions: TimeRangeRestrictionOption[] = [
      {
        id: 'Day',
        label: 'Day',
        milliseconds: 86400000
      }
    ];
    component.timeRangeRestrictionOptions = timeRangeRestrictionOptions;
    component.selectedTimeRangeOption = timeRangeRestrictionOptions[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
