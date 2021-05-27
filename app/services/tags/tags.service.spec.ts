import { TestBed } from '@angular/core/testing';

import { TagsService } from './tags.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityStore} from '@datorama/akita';
import {TagsState} from './models/tags-state';
import {TagsServiceFixtures} from './tags.service.fixtures';
import {HttpErrorResponse} from '@angular/common/http';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';
import {LogLevel} from '../../modules/logger/log-level.enum';
import {Logger} from '../../modules/logger/logger';

describe('TagsService', () => {
  let service: TagsService;
  let httpMock: HttpTestingController;
  let logger: Logger;
  const storeSpy: EntityStore<TagsState> = TagsService.store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
      ]
    });
    service = TestBed.inject(TagsService);
    httpMock = TestBed.inject(HttpTestingController);
    logger = TestBed.inject(Logger);
  });

  afterEach(() => {
    httpMock.verify();
    storeSpy.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTags', () => {
    it('should return tags and set the store', (done) => {
      spyOn(storeSpy, 'set').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getTags()
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(TagsServiceFixtures.TAGS_RESPONSE.tags);
          done();
        });

      const req = httpMock.expectOne(TagsService.TAGS_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush(TagsServiceFixtures.TAGS_RESPONSE);
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(TagsServiceFixtures.TAGS_RESPONSE.tags));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getTags().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(TagsServiceFixtures.ERROR_RESPONSE));
          done();
        });
      const req = httpMock.expectOne(TagsService.TAGS_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush({}, TagsServiceFixtures.ERROR_RESPONSE);

      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(TagsServiceFixtures.ERROR_RESPONSE));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
