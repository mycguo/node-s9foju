import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../shared.module';
import { Component } from '@angular/core';
import { DialogService } from '../../services/dialog/dialog.service';
import { Size } from '../../enums/size';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'nx-confirm-dialog-trigger-host',
  template: `<nx-button (btnClick)="openDialog()">Open Dialog</nx-button>`,
})
class CustomDialogTriggerHostComponent {
  constructor(private dialogService: DialogService) {}

  openDialog() {
    this.dialogService.open(
      ConfirmDialogComponent,
      {
        size: Size.SM,
        data: {
          title: 'Title',
          message: 'Confirm Message',
          confirmButtonMessage: 'Custom Button',
        },
      },
      (value) => {
        console.log('Close dialog returned value: ', value);
      }
    );
  }
}

export default {
  title: 'Shared/Confirm Dialog',

  decorators: [
    moduleMetadata({
      imports: [SharedModule],
    }),
  ],
};

export const Default = () => ({
  component: CustomDialogTriggerHostComponent,
});

Default.story = {
  name: 'default',
};
