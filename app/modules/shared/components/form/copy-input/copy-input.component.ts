import { Component, Input, Output, Self, TemplateRef, EventEmitter } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl
} from '@angular/forms';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { NotificationDowngradeService } from 'src/app/services/notification-downgrade/notification-downgrade.service';
import LaCustomNotificationDefinition from '../../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import { Clipboard } from '@angular/cdk/clipboard';

@UntilDestroy()
@Component({
  selector: 'nx-copy-input',
  templateUrl: './copy-input.component.html',
  styleUrls: ['./copy-input.component.less'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class CopyInputComponent implements ControlValueAccessor {
  @Input() inputModel: SimpleInputModel;
  @Input() validateOnInit = false; // if validation should be run when pristine
  @Input() headerAdditionalElements: TemplateRef<any>;
  @Output() copy = new EventEmitter<string>();

  inputControl: FormControl;
  onTouch: () => void;

  constructor(
    @Self() private controlDir: NgControl,
    private notificationService: NotificationService,
    private clipboard: Clipboard
  ) {
    controlDir.valueAccessor = this;
    this.inputControl = new FormControl();
  }

  get control() {
    return this.controlDir.control;
  }

  writeValue(value: string) {
    this.inputControl.patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn): void {
    this.inputControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable({emitEvent: false, onlySelf: true}) :
      this.inputControl.enable({emitEvent: false, onlySelf: true});
  }

  copyValue(): void {

    // check if browser copies value
    if (this.clipboard.copy(this.inputControl?.value)) {
      this.copy.emit(this.inputControl?.value);
      this.notificationService.sendNotification$(new LaCustomNotificationDefinition(
        'Value copied to clipboard',
        NOTIFICATION_TYPE_ENUM.SUCCESS
      ));

    // show error if value is too large to be instantly handled by browser
    } else {
      this.notificationService.sendNotification$(new LaCustomNotificationDefinition(
        'Failed copy value to clipboard',
        NOTIFICATION_TYPE_ENUM.ALERT
      ));
    }
  }
}
