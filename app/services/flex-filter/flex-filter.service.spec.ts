import { TestBed } from '@angular/core/testing';

import { FlexFilterService } from './flex-filter.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('FlexFilterService', () => {
  let service: FlexFilterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(FlexFilterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFieldValues', () => {
    const fieldResponse = {
      values: [
      'Berlin',
      'Black Hole',
      'Branch1',
    ]};

    it('should return field values', (done) => {
      service.getFieldValues('site', '', 50).subscribe(
        (response) => {
          expect(response).toBeDefined();
          expect(response).toEqual(fieldResponse);
          done();
        }
      );
      const req = httpMock.expectOne(`${service.FLEX_SEARCH_FIELDS_URL}/site/values?valueString=&limit=50`);
      expect(req.request.method).toEqual('GET');
      req.flush(fieldResponse);
    });

    it('should handle error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      service.getFieldValues('site', '', 50).subscribe(
        (response) => {
          expect(response).not.toBeDefined();
          done();
        },
        (err) => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        }
      );
      const req = httpMock.expectOne(`${service.FLEX_SEARCH_FIELDS_URL}/site/values?valueString=&limit=50`);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
    });
  });

  describe('getAutocompleteFieldValues', () => {
    const fieldResponse = [
      {
        'device' : {
          'deviceSerial' : '9RA047IBN39',
          'deviceHostName' : 'HUB2_234',
          'deviceSystemName' : 'HUB2_234.liveaction.com'
        },
        'interfaces' : [ 'GigabitEthernet1', 'GigabitEthernet4', 'Loopback47233', 'Tunnel11', 'Tunnel47233' ]
      }
    ];

    it('should return field values', (done) => {
      service.getAutocompleteFieldValues('interfaceAndDevice', {}, 50).subscribe(
        (response) => {
          expect(response).toBeDefined();
          expect(response).toEqual(fieldResponse);
          done();
        }
      );
      const req = httpMock.expectOne(`${service.AUTOCOMPLETE_SEARCH_URL}/interfaceAndDevice?limit=50`);
      expect(req.request.method).toEqual('GET');
      req.flush(fieldResponse);
    });

    it('should handle error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      service.getAutocompleteFieldValues('interfaceAndDevice', '', 50).subscribe(
        (response) => {
          expect(response).not.toBeDefined();
          done();
        },
        (err) => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        }
      );
      const req = httpMock.expectOne(`${service.AUTOCOMPLETE_SEARCH_URL}/interfaceAndDevice?limit=50`);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
    });
  });
});
