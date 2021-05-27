import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTileAlertComponent } from './notification-tile-alert.component';
import {NotificationTileWrapperComponent} from '../notification-tile-wrapper/notification-tile-wrapper.component';
import {RouterModule} from '@angular/router';
import {TimeAgoPipe} from '../../../shared/pipes/time-ago/time-ago.pipe';
import {TimeDisplayPipe} from '../../pipes/time-display/time-display.pipe';

describe('NotificationTileAlertComponent', () => {
  let component: NotificationTileAlertComponent;
  let fixture: ComponentFixture<NotificationTileAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule
      ],
      declarations: [
        NotificationTileAlertComponent,
        NotificationTileWrapperComponent,
        TimeAgoPipe,
        TimeDisplayPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTileAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
