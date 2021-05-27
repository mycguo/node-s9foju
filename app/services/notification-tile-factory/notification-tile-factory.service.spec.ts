import { TestBed } from '@angular/core/testing';

import { NotificationTileFactoryService } from './notification-tile-factory.service';

describe('NotificationTileFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationTileFactoryService = TestBed.get(NotificationTileFactoryService);
    expect(service).toBeTruthy();
  });
});
