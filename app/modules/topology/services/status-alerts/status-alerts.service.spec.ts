import {getTestBed, TestBed} from '@angular/core/testing';
import {StatusAlertsService} from './status-alerts.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {StatusAlertsStore} from '../../../../store/status-alerts/status-alerts.store';
import SeverityTypes from '../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';
import UserStatusTypes from '../../../../../../../project_typings/api/alerting/alerts/UserStatusTypes';
import AlertTypes from '../../../../../../../project_typings/api/alerting/alerts/AlertTypes';
import LaSourceInfoTypesEnum from '../../../../../../../client/laCommon/constants/laSourceInfoTypes.constant';
import ENTITY_TYPES from '../../../../../../../client/nxComponents/services/laEntityStatus/enums/entityTypes';
import StatusAlertItem from '../../components/status-alerts-item/interfaces/status-alert-item';
import IBaseSite from '../../../../../../../client/nxComponents/services/laNxSite/IBaseSite';
import FilterGeneratorResult from '../../../../../../../client/nxComponents/components/laFilterGeneratorWidget/filterResults/filterGeneratorResult';
import StatusFilterItemBase from '../../../../../../../client/nxComponents/services/laEntityStatus/models/statusFilterItemBase';
import SiteId from '../../../../../../../client/nxComponents/services/laEntityStatus/models/siteId';
import SiteStatusFilterItem from '../../../../../../../client/nxComponents/services/laEntityStatus/models/siteStatusFilterItem';
import LaEntityStatusRequest from '../../../../../../../client/nxComponents/services/laEntityStatus/models/laEntityStatusRequest';
import {StatusAlertsQuery} from '../../../../store/status-alerts/status-alerts.query';
import StatusAlertsSeverity from '../../components/status-alerts/enums/status-alerts-severity';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('StatusAlertsService', () => {
  let injector: TestBed;
  let service: StatusAlertsService;
  let httpMock: HttpTestingController;
  let statusAlertsStoreSpy: StatusAlertsStore;
  const statusAlertsQuerySpy: StatusAlertsQuery = new StatusAlertsQuery(new StatusAlertsStore());

  const responseSites: {sites: IBaseSite[]} = {
    sites: [
      {
        id: 'c4d6ae82-2ff5-4491-a9f4-9e37b27c998c',
        siteName: 'MONTREAL-VE-04'
      }
    ]
  };

  const responseAlerts: StatusAlertItem[] = [
    {
      version: 1,
      alertId: 'fd5b7604-d59e-4df7-a3c4-f1b5b9380029',
      type: AlertTypes.DEVICE_CPU,
      dateCreated: new Date().toString(),
      durationSinceCreatedMinutes: 10697,
      durationActiveMinutes: 10697,
      severity: SeverityTypes.CRITICAL,
      userStatus: UserStatusTypes.ACTIVE,
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
            type: LaSourceInfoTypesEnum.DEVICE,
            label: 'Device',
            displayValue: 'NYC-SwitchV1.liveaction.com',
            rawValue: {
              deviceSerial: '9608UCQXQMU',
              deviceName: 'NYC-SwitchV1.liveaction.com'
            }
          }
        ],
        linkInfo: [],
        tableInfo: undefined
      },
      alertIntegrations: {
        serviceNowAlertIntegration: null
      },
      sourceSite: {
        siteId: 'c4d6ae82-2ff5-4491-a9f4-9e37b27c998c',
        siteName: 'MONTREAL-VE-04'
      }
    }
  ];

  const entityId = <StatusFilterItemBase<SiteId>>{
    type: ENTITY_TYPES.site,
    id: {
      siteId: 'c4d6ae82-2ff5-4491-a9f4-9e37b27c998c'
    }
  };

  const responseStatus = {
    statusAggregations: [
      {
        alerts: responseAlerts,
        entityId: entityId,
        status: 'Critical'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        StatusAlertsStore,
        {provide: StatusAlertsQuery, useValue: statusAlertsQuerySpy}
      ]
    });
    injector = getTestBed();
    service = injector.get(StatusAlertsService);
    httpMock = injector.get(HttpTestingController);
    statusAlertsStoreSpy = injector.get(StatusAlertsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStatusAlerts$', () => {
    it('should call the api and store the result', (done) => {
      spyOn(statusAlertsStoreSpy, 'set').and.callThrough();
      spyOn(statusAlertsStoreSpy, 'setLoading').and.callThrough();
      service.getStatusAlerts$()
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(responseAlerts);
          done();
        });

      const sitesReq = httpMock.expectOne(service.SITES_QUERY_URL);
      expect(sitesReq.request.method).toEqual('POST');
      sitesReq.flush(responseSites);

      const statusReq = httpMock.expectOne(service.STATUS_QUERY_URL);
      expect(statusReq.request.method).toEqual('POST');
      statusReq.flush(responseStatus);

      expect(statusAlertsStoreSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(responseAlerts));
      expect(statusAlertsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
      httpMock.verify();
    });

    it('should call the api with site filters and store the result', (done) => {
      spyOn(statusAlertsStoreSpy, 'set').and.callThrough();
      spyOn(statusAlertsStoreSpy, 'setLoading').and.callThrough();

      const filters: FilterGeneratorResult[] = [
        new FilterGeneratorResult('site', [{id: 'MONTREAL-VE-04', name: 'MONTREAL-VE-04'}])
      ];
      service.getStatusAlerts$(filters)
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(responseAlerts);
          done();
        });

      const sitesReq = httpMock.expectOne(service.SITES_QUERY_URL);
      expect(sitesReq.request.method).toEqual('POST');
      sitesReq.flush(responseSites);

      const statusReq = httpMock.expectOne(service.STATUS_QUERY_URL);
      expect(statusReq.request.method).toEqual('POST');
      expect(statusReq.request.body).toEqual(<LaEntityStatusRequest>{
        type: ENTITY_TYPES.site,
        filter: [new SiteStatusFilterItem('c4d6ae82-2ff5-4491-a9f4-9e37b27c998c')]
      });
      statusReq.flush(responseStatus);

      expect(statusAlertsStoreSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(responseAlerts));
      expect(statusAlertsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
      httpMock.verify();
    });

    it('should call the api with status filters and store the result', (done) => {
      spyOn(statusAlertsStoreSpy, 'set').and.callThrough();
      spyOn(statusAlertsStoreSpy, 'setLoading').and.callThrough();

      const filters: FilterGeneratorResult[] = [
        new FilterGeneratorResult('status', [{id: 'critical', name: 'Critical'}])
      ];
      service.getStatusAlerts$(filters)
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(responseAlerts);
          done();
        });

      const sitesReq = httpMock.expectOne(service.SITES_QUERY_URL);
      expect(sitesReq.request.method).toEqual('POST');
      sitesReq.flush(responseSites);

      const statusReq = httpMock.expectOne(service.STATUS_QUERY_URL);
      expect(statusReq.request.method).toEqual('POST');
      expect(statusReq.request.body).toEqual(<LaEntityStatusRequest>{
        type: ENTITY_TYPES.site,
        filter: []
      });
      statusReq.flush(responseStatus);

      expect(statusAlertsStoreSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(responseAlerts));
      expect(statusAlertsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
      httpMock.verify();
    });

    it('should call the api with status filters and store empty result', (done) => {
      spyOn(statusAlertsStoreSpy, 'set').and.callThrough();
      spyOn(statusAlertsStoreSpy, 'setLoading').and.callThrough();

      const filters: FilterGeneratorResult[] = [
        new FilterGeneratorResult('status', [{id: 'warning', name: 'Warning'}])
      ];
      service.getStatusAlerts$(filters)
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual([]);
          done();
        });

      const sitesReq = httpMock.expectOne(service.SITES_QUERY_URL);
      expect(sitesReq.request.method).toEqual('POST');
      sitesReq.flush(responseSites);

      const statusReq = httpMock.expectOne(service.STATUS_QUERY_URL);
      expect(statusReq.request.method).toEqual('POST');
      expect(statusReq.request.body).toEqual(<LaEntityStatusRequest>{
        type: ENTITY_TYPES.site,
        filter: []
      });
      statusReq.flush({statusAggregations: []});

      expect(statusAlertsStoreSpy.set).toHaveBeenCalledWith(jasmine.objectContaining([]));
      expect(statusAlertsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
      httpMock.verify();
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(statusAlertsStoreSpy, 'setError').and.callThrough();
      spyOn(statusAlertsStoreSpy, 'setLoading').and.callThrough();
      service.getStatusAlerts$().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(service.SITES_QUERY_URL);
      expect(req.request.method).toEqual('POST');
      req.flush({}, {status: 500, statusText: 'Server Error'});
      expect(statusAlertsStoreSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(statusAlertsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
      httpMock.verify();
    });
  });

  describe('setActiveAlert', () => {
    it('should set active alert', () => {
      const alertId = 'fd5b7604-d59e-4df7-a3c4-f1b5b9380029';
      spyOn(statusAlertsStoreSpy, 'setActive').and.callThrough();
      spyOn(statusAlertsQuerySpy, 'getActive').and.callFake(() => {
        return responseAlerts[0];
      });
      const alert = service.setActiveAlert(alertId);
      expect(statusAlertsStoreSpy.setActive).toHaveBeenCalledWith(alertId);
      expect(alert).toEqual(responseAlerts[0]);
    });
  });

  describe('updateFilter', () => {
    it('should update filter', () => {
      const filter = StatusAlertsSeverity.CRITICAL;
      spyOn(statusAlertsStoreSpy, 'setSeverityFilter').and.callThrough();
      service.updateFilter(filter);
      expect(statusAlertsStoreSpy.setSeverityFilter).toHaveBeenCalledWith(filter);
    });
  });

  describe('setHistoricalAlert', () => {
    it('shuld set error message', () => {
      const error = {
        clientMessage: 'Historic alert status unavailable. To view current alert status, set end date and time to "now".'
      };
      spyOn(statusAlertsStoreSpy, 'setLoading').and.callThrough();
      spyOn(statusAlertsStoreSpy, 'setError').and.callThrough();
      service.setHistoricalAlert();
      expect(statusAlertsStoreSpy.setError).toHaveBeenCalledWith(error);
      expect(statusAlertsStoreSpy.setLoading).toHaveBeenCalledTimes(1);
    });
  });
});
