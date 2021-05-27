import {TestBed} from '@angular/core/testing';

import {ServiceNowDescriptionService} from './service-now-description.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CommonService} from '../../../../utils/common/common.service';
import {Query, Store} from '@datorama/akita';
import {ServiceNowDescriptionState} from './service-now-description-state';
import {ServiceNowFieldTypes} from '../service-now-fields/models/service-now-field-types.enum';
import {ServiceNowFieldResponse} from '../service-now-fields/models/service-now-field-response';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ServiceNowDescriptionService', () => {
  let service: ServiceNowDescriptionService;
  let httpMock: HttpTestingController;
  let storeSpy: Store<ServiceNowDescriptionState>;
  let querySpy: Query<ServiceNowDescriptionState>;
  let fixture: ServiceNowFieldResponse;

  beforeEach(() => {
    fixture = {
      id: 'a',
      fieldName: 'a',
      displayValue: 'a',
      defaultValue: void 0,
      isDependentOnField: false,
      dependentField: void 0,
      isReference: false,
      referenceTableName: void 0,
      nxFieldType: ServiceNowFieldTypes.drop_down
    } as ServiceNowFieldResponse;

    storeSpy = new Store<ServiceNowDescriptionState>(ServiceNowDescriptionService.INITIAL_STATE, {
      name: ServiceNowDescriptionService.STORE_NAME,
      resettable: true
    });
    querySpy = new Query<ServiceNowDescriptionState>(storeSpy);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        CommonService,
        {provide: Store, useValue: storeSpy},
        {provide: Query, useValue: querySpy}
      ]
    });
    service = TestBed.inject(ServiceNowDescriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectDescription', () => {
    it('should return description', (done) => {
      spyOn(querySpy, 'select').and.returnValue(cold('x|', {x: fixture}));
      service.selectDescription()
        .subscribe((field: ServiceNowFieldResponse) => {
          expect(field).toBeDefined();
          done();
        });
      getTestScheduler().flush();
    });
  });

  describe('getDescription', () => {
    it('should get the description information from the api', (done) => {
      spyOn(storeSpy, 'update').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getDescription().subscribe(data => {
        expect(data).toBeDefined();
        done();
      });
      const req = httpMock.expectOne(`${ServiceNowDescriptionService.SERVICE_NOW_ENDPOINT}`);
      expect(req.request.method).toEqual('GET');
      req.flush(fixture);
      expect(storeSpy.update).toHaveBeenCalled();
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(3);
    });
  });

  describe('update', () => {
    it('should update the description information', (done) => {
      spyOn(storeSpy, 'update').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.update(fixture).subscribe(data => {
        expect(data).toBeDefined();
        done();
      });
      const req = httpMock.expectOne(`${ServiceNowDescriptionService.SERVICE_NOW_ENDPOINT}`);
      expect(req.request.method).toEqual('PUT');
      req.flush(fixture);
      expect(storeSpy.update).toHaveBeenCalled();
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
