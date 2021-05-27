import { TestBed } from '@angular/core/testing';

import { NotificationDowngradeService } from './notification-downgrade.service';

describe('NotificationDowngradeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationDowngradeService = TestBed.get(NotificationDowngradeService);
    expect(service).toBeTruthy();
  });
});
