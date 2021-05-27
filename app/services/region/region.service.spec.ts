import {TestBed} from '@angular/core/testing';

import {RegionService} from './region.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Region} from './region';
import {RegionType} from './region-type.enum';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('RegionService', () => {
  let service: RegionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(RegionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRegions', () => {
    const regionResponse: Region[] = [
      {
        'id': '441c7ed7-6a6a-43ca-8b96-95da4d5527c3',
        'longName': 'England',
        'shortName': 'England',
        'type': RegionType.STATE,
        'parent': {
          'id': '0d85c4b3-eda4-4d90-acb7-df753d97280b',
          'longName': 'United Kingdom',
          'shortName': 'GBR',
          'type': RegionType.COUNTRY,
          'parent': {
            'id': '1157a6f2-43a7-4194-9832-0a2cce7407c6',
            'longName': 'Europe',
            'shortName': 'EU',
            'type': RegionType.CONTINENT,
            'parent': null
          }
        }
      }
    ];

    it('should return regions', (done) => {
      service.getRegions('', 50).subscribe(
        (regions: Region[]) => {
          expect(regions).toBeDefined();
          expect(regions).toEqual(regionResponse);
          done();
        }
      );
      const req = httpMock.expectOne(`${service.REGION_URL}?hint=&numResults=50`);
      expect(req.request.method).toEqual('GET');
      req.flush({regions: regionResponse});
    });

    it('should handle error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      service.getRegions('', 50).subscribe(
        (regions: Region[]) => {
          expect(regions).not.toBeDefined();
          done();
        },
        (err) => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        }
      );
      const req = httpMock.expectOne(`${service.REGION_URL}?hint=&numResults=50`);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
    });
  });
});
