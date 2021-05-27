import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { NotificationsListDirective } from './directives/notifications-list/notifications-list.directive';
import { NotificationTileGeneralComponent } from './components/notification-tile-general/notification-tile-general.component';
import { NotificationTileAlertComponent } from './components/notification-tile-alert/notification-tile-alert.component';
import { NotificationTilesDateGroupComponent } from './components/notification-tiles-date-group/notification-tiles-date-group.component';
import { NotificationTileWrapperComponent } from './components/notification-tile-wrapper/notification-tile-wrapper.component';
import {SharedModule} from '../shared/shared.module';
import {TimeDisplayPipe} from './pipes/time-display/time-display.pipe';
import { NotificationTilesDateGroupContainer } from './containers/notification-tiles-date-group/notification-tiles-date-group.container';

@NgModule({
  declarations: [
    NotificationsListDirective,
    NotificationTileGeneralComponent,
    NotificationTileAlertComponent,
    NotificationTilesDateGroupComponent,
    NotificationTileWrapperComponent,
    TimeDisplayPipe,
    NotificationTilesDateGroupContainer
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    NotificationsListDirective,
    NotificationTileGeneralComponent,
    NotificationTileAlertComponent,
    NotificationTilesDateGroupComponent,
    NotificationTileWrapperComponent,
    NotificationTilesDateGroupContainer,
  ]
})
export class NotificationsModule { }
