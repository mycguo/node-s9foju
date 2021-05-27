import {TestBed} from '@angular/core/testing';

import {NodesService} from './nodes.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityStore} from '@datorama/akita';
import {NodesState} from './models/node-state';
import {CommonService} from '../../utils/common/common.service';
import {NodesServiceFixtures} from './nodes.service.fixtures';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('NodesService', () => {
  let service: NodesService;
  let httpMock: HttpTestingController;
  let storeSpy: EntityStore<NodesState>;

  beforeEach(() => {
    storeSpy = new EntityStore<NodesState>(NodesService.INITIAL_STATE, {name: NodesService.STORE_NAME});
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        CommonService,
        {provide: EntityStore, useValue: storeSpy}
      ]
    });
    service = TestBed.inject(NodesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNodes$', () => {
    it('should call the api and store the result', (done) => {

      spyOn(storeSpy, 'set').and.callThrough();
      spyOn(storeSpy, 'setActive').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getNodes().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(NodesServiceFixtures.NODES);
        done();
      });
      const req = httpMock.expectOne(NodesService.NODES_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({meta: {}, nodes: NodesServiceFixtures.NODES});
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(NodesServiceFixtures.NODES));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();

      service.getNodes()
        .subscribe((data) => {
            expect(data).not.toBeDefined();
            done();
          },
          (err) => {
            expect(err).toBeDefined();
            expect(err).toEqual(jasmine.objectContaining(error));
            done();
          });
      const req = httpMock.expectOne(NodesService.NODES_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
