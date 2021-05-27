import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTileWrapperComponent } from './notification-tile-wrapper.component';
import {RouterModule} from '@angular/router';
import {TimeAgoPipe} from '../../../shared/pipes/time-ago/time-ago.pipe';
import {TimeDisplayPipe} from '../../pipes/time-display/time-display.pipe';

describe('NotificationTileWrapperComponent', () => {
  let component: NotificationTileWrapperComponent;
  let fixture: ComponentFixture<NotificationTileWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule
      ],
      declarations: [
        NotificationTileWrapperComponent,
        TimeAgoPipe,
        TimeDisplayPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
