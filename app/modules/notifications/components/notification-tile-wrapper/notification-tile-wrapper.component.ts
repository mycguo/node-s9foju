import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import NxNotification from '../../../../services/nx-notifications/nx-notification.model';

@Component({
  selector: 'nx-notification-tile-wrapper',
  templateUrl: './notification-tile-wrapper.component.html',
  styleUrls: ['./notification-tile-wrapper.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationTileWrapperComponent implements OnInit {

  @Input() notificationTypeTitle: string;
  @Input() notificationBodyTitle: string;
  @Input() drilldownUrl: string;
  @Input() notificationLabel: string;
  @Input() notificationDateCreated: Date;
  @Input() isNotificationHidingActive: boolean;
  @Input() isLast = false;
  @Output() closeNotification = new EventEmitter<NxNotification>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  /**
   * @func removeNotification
   * @desc Changes the 'unread' property of the current notification with block animation
   */
  removeNotification() {
    this.animateRemovingNotifications();
    setTimeout(() => {
      // this.laNotificationService.closeNotification(notification);
    }, 650);
  }

  /**
   * @func removeNotification
   * @desc "Hiding" animation for removing block
   */
  private animateRemovingNotifications() {
    const wrapper: any = (this.elementRef.nativeElement).closest('.la-notifications-side-bar__notifications-group-item');
    const siblingsAmount = wrapper.parentElement.children ? wrapper.parentElement.children.length : 0;
    if (siblingsAmount !== 0) {
      this.isNotificationHidingActive = true;
      let wrapperHeight: number = wrapper.offsetHeight;
      const wrapperBottomSpace = 6;

      this.renderer.addClass(wrapper, 'la-notifications-side-bar__notifications-group-item_hidden');
      if (this.isLast) {
        wrapperHeight += wrapperBottomSpace;
      }

      setTimeout(() => {
        this.renderer.setStyle(wrapper, 'marginBottom', `${-wrapperHeight}px`);
      }, 300);

    } else {
      wrapper.closest('.la-notifications-side-bar__notifications-group').slideUp(450);
    }
  }

}
