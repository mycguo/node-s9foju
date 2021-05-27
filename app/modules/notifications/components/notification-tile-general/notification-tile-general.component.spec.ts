import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTileGeneralComponent } from './notification-tile-general.component';
import {NotificationTileWrapperComponent} from '../notification-tile-wrapper/notification-tile-wrapper.component';
import {RouterModule} from '@angular/router';
import {TimeAgoPipe} from '../../../shared/pipes/time-ago/time-ago.pipe';
import {TimeDisplayPipe} from '../../pipes/time-display/time-display.pipe';

describe('NotificationTileGeneralComponent', () => {
  let component: NotificationTileGeneralComponent;
  let fixture: ComponentFixture<NotificationTileGeneralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule
      ],
      declarations: [
        NotificationTileGeneralComponent,
        NotificationTileWrapperComponent,
        TimeAgoPipe,
        TimeDisplayPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTileGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
