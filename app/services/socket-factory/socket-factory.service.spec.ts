import { TestBed } from '@angular/core/testing';

import { SocketFactoryService } from './socket-factory.service';

describe('SocketFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketFactoryService = TestBed.get(SocketFactoryService);
    expect(service).toBeTruthy();
  });
});
