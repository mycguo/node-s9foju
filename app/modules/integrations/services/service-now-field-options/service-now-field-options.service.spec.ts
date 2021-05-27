import {getTestBed, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ServiceNowFieldOptionsService} from './service-now-field-options.service';
import {ServiceNowFieldOptionResponse} from './models/service-now-field-option-response';
import {ServiceNowFieldTypes} from '../service-now-fields/models/service-now-field-types.enum';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ServiceNowAlertOptionsService', () => {
  let injector: TestBed;
  let service: ServiceNowFieldOptionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    injector = getTestBed();
    service = injector.inject(ServiceNowFieldOptionsService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOptions', () => {
    const validGetResponse: { fieldOptions: ServiceNowFieldOptionResponse[] } = {
      fieldOptions: [
        {
          fieldName: 'test',
          value: 'test',
          displayValue: 'test',
          parentFieldName: 'test',
          parentValue: 'test'
        }
      ]
    };

    it('should call api and store the result', (done) => {
      service.getOptions({
          fieldName: 'test',
          displayValue: 'test',
          defaultValue: 'a',
          isDependentOnField: false,
          dependentField: null,
          isReference: false,
          referenceTableName: null,
          nxFieldType: ServiceNowFieldTypes.drop_down
        },
        'test',
        'test'
      ).subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(jasmine.objectContaining(validGetResponse.fieldOptions));
        done();
      });
      const req = httpMock.expectOne(`${ServiceNowFieldOptionsService.SERVICE_NOW_FIELD_OPTIONS_URL}`);
      expect(req.request.method).toEqual('POST');
      req.flush(validGetResponse);
    });

    it('should call api and store the error', (done) => {
      const error = {
        status: 500,
        statusText: 'Server Error',

      };

      const detailedError = {
        message: 'Http failure response for /api/nx/serviceNow/fieldOptions: 500 Server Error'
      };
      service.getOptions({
          fieldName: 'test',
          displayValue: 'test',
          defaultValue: 'a',
          isDependentOnField: false,
          dependentField: null,
          isReference: false,
          referenceTableName: null,
          nxFieldType: ServiceNowFieldTypes.drop_down
        },
        'test',
        'test').subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(detailedError));
          done();
        });
      const req = httpMock.expectOne(`${ServiceNowFieldOptionsService.SERVICE_NOW_FIELD_OPTIONS_URL}`);
      expect(req.request.method).toEqual('POST');
      req.flush({}, error);
    });
  });
});
