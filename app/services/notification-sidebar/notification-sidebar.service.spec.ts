import { TestBed } from '@angular/core/testing';

import { NotificationSidebarService } from './notification-sidebar.service';

describe('NotificationSidebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationSidebarService = TestBed.get(NotificationSidebarService);
    expect(service).toBeTruthy();
  });
});
