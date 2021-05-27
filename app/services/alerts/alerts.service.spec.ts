import { TestBed } from '@angular/core/testing';

import { AlertsService } from './alerts.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import Alert from './alert.model';
import {AlertsQuery} from '../../store/alerts/alerts.query';
import AlertsSummary from './alertsSummary.model';
import AlertStatus from './alertStatus.enum';
import {AlertsStore} from '../../store/alerts/alerts.store';
import SeverityTypes from '../../../../../project_typings/api/alerting/alerts/SeverityTypes';
import {CookieService} from 'ngx-cookie-service';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

class MockAlertsStore extends AlertsStore {
  currentSummary = null;

  constructor() {
    super();
  }
  setAlertSummary(alertSummary: AlertsSummary) {
    this.currentSummary = alertSummary;
  }
}

const mockAlertsStore = new MockAlertsStore();

class MockAlertsQuery extends AlertsQuery {
  alertSummary = new AlertsSummary();
  /// move alerts list to const here
  constructor(protected store: AlertsStore) {
    super(store);
    this.alertSummary.alertsList = [
      { alertId: '1', severity: 'critical', userStatus: AlertStatus.ACTIVE },
      { alertId: '2', severity: 'critical', userStatus: AlertStatus.ACTIVE },
      { alertId: '3', severity: 'critical', userStatus: AlertStatus.ACTIVE },
      { alertId: '4', severity: 'warning', userStatus: AlertStatus.ACTIVE },
      { alertId: '5', severity: 'warning', userStatus: AlertStatus.ACTIVE },
      { alertId: '6', severity: 'warning', userStatus: AlertStatus.ACTIVE },
      { alertId: '7', severity: 'warning', userStatus: AlertStatus.ACTIVE },
      { alertId: '8', severity: 'info', userStatus: AlertStatus.ACTIVE },
      { alertId: '9', severity: 'info', userStatus: AlertStatus.ACTIVE },
    ];
    this.alertSummary.critical = 3;
    this.alertSummary.warning = 4;
    this.alertSummary.info = 2;
  }

  getValue() {
    return {
      /// send new alert summary here
      alertSummary: this.alertSummary,
      filteredAlerts: null
    };
  }
}

const mockAlertsQuery = new MockAlertsQuery(mockAlertsStore);

describe('AlertsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      LoggerTestingModule
    ],
    providers: [
      { provide: AlertsQuery, useValue: mockAlertsQuery },
      { provide: AlertsStore, useValue: mockAlertsStore },
      CookieService
    ]
  }));

  it('should be created', () => {
    const service: AlertsService = TestBed.get(AlertsService);
    expect(service).toBeTruthy();
  });

  it('should reduce alerts to a summary', () => {
    const service: AlertsService = TestBed.get(AlertsService);
    const generateAlertWithSeverity = (serverity: string) => {
      const alert = new Alert();
      alert.severity = serverity;
      return alert;
    };
    const mockAlerts = [
      generateAlertWithSeverity('critical'),
      generateAlertWithSeverity('critical'),
      generateAlertWithSeverity('critical'),
      generateAlertWithSeverity('warning'),
      generateAlertWithSeverity('warning'),
      generateAlertWithSeverity('info'),
    ];
    const summary = service.reduceAlertsToSummary(mockAlerts);

    expect(summary.critical).toBe(3);
    expect(summary.warning).toBe(2);
    expect(summary.info).toBe(1);
  });

  it('should add a count to the alert summary on alert notification', () => {
    const alertNotification = {
      alertId: '10',
      severity: <SeverityTypes>'critical',
      userStatus: 'ACTIVE'
    };
    const service: AlertsService = TestBed.get(AlertsService);
    service.updateSummaryCount(alertNotification);
    expect(mockAlertsStore.currentSummary.critical).toEqual(4);
  });
});
