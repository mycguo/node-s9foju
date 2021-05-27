import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeviceEntityPageReportsComponent } from './device-entity-page-reports.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportInfoValue } from '../../../reporting/models/report-info';
import ReportCategoryParameter from '../../../reporting/models/api/parameter-enums/report-category-parameter';

describe('DeviceEntityPageReportsComponent', () => {
  let component: DeviceEntityPageReportsComponent;
  let fixture: ComponentFixture<DeviceEntityPageReportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
      ],
      declarations: [ DeviceEntityPageReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceEntityPageReportsComponent);
    component = fixture.componentInstance;

    component.reports = <ReportInfoValue[]>[{
      id: '1',
      name: 'Name',
      reportBase: 'Flow',
      reportCategory: ReportCategoryParameter.FLOW,
      allowsAllDevices: true,
      allowsAllInterfaces: true,
      availableParameters: [{
        queryKey: 'queryKey',
        parameterType: 'text'
      }],
      isSavedReport: false,
      isRestrictedReport: false
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
