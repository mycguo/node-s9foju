import { TestBed } from '@angular/core/testing';

import { NotificationGroupService } from './notification-group.service';
import {NotificationGroupStore} from '../../store/notificationGroup/notificationGroup.store';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NotificationGroupQuery} from '../../store/notificationGroup/notificationGroup.query';

describe('NotificationGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      NotificationGroupStore,
      NotificationGroupQuery
    ]
  }));

  it('should be created', () => {
    const service: NotificationGroupService = TestBed.get(NotificationGroupService);
    expect(service).toBeTruthy();
  });
});
