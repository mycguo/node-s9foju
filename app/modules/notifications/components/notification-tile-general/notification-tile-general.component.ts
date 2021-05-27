import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import NotificationTileComponent from '../../../../services/notification-tile-factory/notification-tile-component';
import NotificationTileTypes from '../../../../services/notification-tile-factory/notification-tile-types.enum';
import NxNotification from '../../../../services/nx-notifications/nx-notification.model';

@Component({
  selector: 'nx-notification-tile-general',
  templateUrl: './notification-tile-general.component.html',
  styleUrls: ['./notification-tile-general.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationTileGeneralComponent implements NotificationTileComponent, OnInit {

  @Input() notification: NxNotification;

  @HostBinding('class.la-notifications-side-bar__notifications-group-item') groupItem = true;

  componentType = NotificationTileTypes.GENERAL;

  constructor() { }

  ngOnInit() {
  }


}
