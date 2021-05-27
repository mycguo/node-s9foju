import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {StatusAlertsComponent} from './status-alerts.component';
import {StatusAlertDetailsDrawerComponent} from '../status-alert-details-drawer/status-alert-details-drawer.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../../../shared/shared.module';
import {StatusAlertsItemComponent} from '../status-alerts-item/status-alerts-item.component';
import {StatusTimePipe} from '../../pipes/status-time.pipe';
import {StatusAlertDetailsParametersGroupComponent} from '../status-alert-details-parameters-group/status-alert-details-parameters-group.component';
import {RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

const currentDate = new Date().toString();
const alertItem: any = {
  version: 1,
  alertId: 'fd5b7604-d59e-4df7-a3c4-f1b5b9380029',
  type: 'DEVICE_CPU',
  dateCreated: currentDate,
  durationSinceCreatedMinutes: 10697,
  durationActiveMinutes: 10697,
  severity: 'Critical',
  userStatus: 'ACTIVE',
  alertState: 'ACTIVE',
  dateOfLastAlertStateChange: '2019-10-23T00:12:32.031Z',
  description: {
    title: 'Device CPU Utilization',
    summary: 'NYC-SwitchV1.liveaction.com CPU utilization is above threshold',
    details: [
      {
        label: 'Device',
        value: 'NYC-SwitchV1.liveaction.com'
      },
      {
        label: 'Initial CPU Percentage',
        value: '82 %'
      },
      {
        label: 'Latest CPU Percentage',
        value: '85 %'
      }
    ],
    sourceInfo: [
      {
        type: 'DEVICE',
        label: 'Device',
        displayValue: 'NYC-SwitchV1.liveaction.com',
        rawValue: {
          deviceSerial: '9608UCQXQMU',
          deviceName: 'NYC-SwitchV1.liveaction.com'
        }
      }
    ]
  },
  alertIntegrations: {
    serviceNowAlertIntegration: null
  },
  sourceSite: {
    siteId: 'c4d6ae82-2ff5-4491-a9f4-9e37b27c998c',
    siteName: 'MONTREAL-VE-04'
  }
};

describe('StatusAlertsComponent', () => {
  let component: StatusAlertsComponent;
  let fixture: ComponentFixture<StatusAlertsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        SharedModule,
        NgSelectModule,
        MatSidenavModule,
        LoggerTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        StatusTimePipe,
        StatusAlertsComponent,
        StatusAlertsItemComponent,
        StatusAlertDetailsDrawerComponent,
        StatusAlertDetailsParametersGroupComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAlertsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.alertsLimit = {limit: 1, isReached: true};
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display spinner', () => {
    const spinnerEl: HTMLElement = fixture.nativeElement.querySelector('nx-spinner');
    component.isLoading = true;
    component.alertsLimit = {limit: 1, isReached: true};
    fixture.detectChanges();
    expect(spinnerEl).toBeDefined();
  });

  it('should display alert', () => {
    const alertEl: HTMLElement = fixture.nativeElement.querySelector('nx-status-alerts-item');
    component.alerts = [alertItem];
    component.isLoading = false;
    component.alertsLimit = {limit: 1, isReached: true};
    fixture.detectChanges();
    expect(alertEl).toBeDefined();
  });

  it('should display limit message', () => {
    const limitEl: HTMLElement = fixture.nativeElement.querySelector('alerts-count-info');
    component.alerts = [alertItem];
    component.isLoading = false;
    component.alertsLimit = {limit: 1, isReached: true};
    fixture.detectChanges();
    expect(limitEl).toBeDefined();
  });

  it('should not display limit message', () => {
    const limitEl: HTMLElement = fixture.nativeElement.querySelector('alerts-count-info');
    component.alerts = [alertItem];
    component.isLoading = false;
    component.alertsLimit = {limit: 1, isReached: false};
    fixture.detectChanges();
    expect(limitEl).toBeNull();
  });
});
