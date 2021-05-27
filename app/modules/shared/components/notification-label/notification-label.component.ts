import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { NOTIFICATION_LABEL_STATUS_MODIFIER_PREFIX } from './const/notification-label-status-modifier-prefix.const';
import { NotificationLabelStatus } from './enums/notification-label-status.enum';

@Component({
  selector: 'nx-notification-label',
  templateUrl: './notification-label.component.html',
  styleUrls: ['./notification-label.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('contentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50%)' }),
        animate('.4s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
    ])
  ]
})
export class NotificationLabelComponent {
  @Input() status: NotificationLabelStatus;
  @HostBinding('class') get statusModifier() {
    return NOTIFICATION_LABEL_STATUS_MODIFIER_PREFIX + (this.status || NotificationLabelStatus.INFO);
  }
}
