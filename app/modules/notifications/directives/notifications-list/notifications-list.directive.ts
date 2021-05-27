import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[nxNotificationsList]'
})
export class NotificationsListDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
