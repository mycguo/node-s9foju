import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusAlertsItemComponent } from './status-alerts-item.component';
import {StatusTimePipe} from '../../pipes/status-time.pipe';
import {format} from 'date-fns';

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
  dateOfLastAlertStateChange: currentDate,
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

describe('StatusAlertsItemComponent', () => {
  let component: StatusAlertsItemComponent;
  let fixture: ComponentFixture<StatusAlertsItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StatusAlertsItemComponent,
        StatusTimePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAlertsItemComponent);
    component = fixture.componentInstance;
    component.alert = alertItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date as time (hh:mm A)', () => {
    const headerTitleEl: HTMLElement = fixture.nativeElement.querySelector('.entity-alert-severity-indicator__text');
    const dateEl: HTMLElement = fixture.nativeElement.querySelector('.header-time');
    expect(headerTitleEl.textContent).toContain('MONTREAL-VE-04');
    expect(dateEl.textContent).toContain(format(currentDate, 'hh:mm A'));
  });
});
