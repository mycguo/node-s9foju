import { moduleMetadata } from '@storybook/angular';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SimpleInputModel } from '../form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../form/simple-input/models/html-input-types.enum';
import { SharedModule } from '../../shared.module';
import { DialogService } from '../../services/dialog/dialog.service';
import { DialogComponent } from '../dialog/dialog.component';
import { action } from '@storybook/addon-actions';

const defaultModeMarkdown = require('./notes/base.notes.md');
const sizeModeMarkdown = require('./notes/size.notes.md');
const customHeaderModeMarkdown = require('./notes/custom-header.notes.md');

@Component({
  template: `
    <nx-modal-container
      titleText="Modal Title"
      (closeButtonClicked)="close()"
      [bodyTpl]="body"
      [footerTpl]="footer"
    >
      <ng-template #body>
        <form [formGroup]="formGroup">
          <nx-simple-input
            class="row row_single"
            formControlName="firstInput"
            [inputModel]="firstInputModel"
          >
          </nx-simple-input>

          <nx-simple-input
            class="row row_single"
            formControlName="secondInput"
            [inputModel]="secondInputModel"
          >
          </nx-simple-input>
        </form>
      </ng-template>

      <ng-template #footer>
        <div nxButtonList>
          <nx-button (btnClick)="close()">Cancel</nx-button>
          <nx-button isPrimary="true">Primary Button</nx-button>
        </div>
      </ng-template>
    </nx-modal-container>
  `,
})
// @ts-ignore
export class ModalContainerDialogStories extends DialogComponent<any> {
  public formGroup: FormGroup;
  public firstInputModel: SimpleInputModel;
  public secondInputModel: SimpleInputModel;
  // @ts-ignore
  @Output() cancelConfigModalClick = new EventEmitter<void>();
  constructor(
    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public fb: FormBuilder
  ) {
    super(data, dialogRef);
    this.formGroup = this.fb.group({
      firstInput: '',
      secondInput: '',
    });

    this.firstInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'First Input'
    );

    this.secondInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Second Input'
    );
  }
}

@Component({
  template: `
    <nx-modal-container
      [headerTpl]="header"
      (closeButtonClicked)="closeDialogCallbackFn()"
      [footerTpl]="footer"
    >
      <ng-template #header>
        <p class="nx-modal-title">Custom Header with Custom Close Function</p>
        <button
          class="nx-modal-close-btn"
          (click)="closeDialogCallbackFn()"
          type="button"
        ></button>
      </ng-template>

      <ng-template #footer>
        <div nxButtonList>
          <nx-button (btnClick)="close()">Cancel</nx-button>
          <nx-button isPrimary="true">Primary Button</nx-button>
        </div>
      </ng-template>
    </nx-modal-container>
  `,
  styleUrls: ['./styles/modal-container-inner-elements.less'],
})
// @ts-ignore
export class ModalContainerCustomHeaderDialogStories extends DialogComponent<
  any
> {
  public closeDialogCallbackFn() {
    action('Some custom function')(
      'Some custom function before close the dialog'
    );
    this.close();
  }
}

@Component({
  template: `
    <div nxButtonList>
      <nx-button (btnClick)="openModal('sm')">Open Small Modal</nx-button>
      <nx-button (btnClick)="openModal('md')">Open Medium Modal</nx-button>
      <nx-button (btnClick)="openModal('lg')">Open Large Modal</nx-button>
      <nx-button (btnClick)="openModal('lg', true)"
        >Open Custom Header Modal</nx-button
      >
    </div>
  `,
})
// @ts-ignore
export class ModalContainerButtonStories {
  constructor(public dialogService: DialogService) {}
  openModal(size, hasCustomHeader?) {
    if (hasCustomHeader) {
      this.dialogService.open(
        ModalContainerCustomHeaderDialogStories,
        { data: {}, size: size },
        () => {
          console.log(this);
        }
      );
    } else {
      this.dialogService.open(
        ModalContainerDialogStories,
        { data: {}, size: size },
        () => {
          console.log(this);
        }
      );
    }
  }
}

export default {
  title: 'Shared/Modal Container',

  decorators: [
    moduleMetadata({
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        SharedModule,
        ReactiveFormsModule,
      ],
      declarations: [
        ModalContainerButtonStories,
        ModalContainerDialogStories,
        ModalContainerCustomHeaderDialogStories,
      ],
    }),
  ],

  excludeStories: [
    'ModalContainerDialogStories',
    'ModalContainerCustomHeaderDialogStories',
    'ModalContainerButtonStories',
  ],
};

export const Base = () => ({
  component: ModalContainerButtonStories,
});

Base.story = {
  parameters: { notes: { markdown: defaultModeMarkdown } },
};

export const Size = () => ({
  component: ModalContainerButtonStories,
});

Size.story = {
  parameters: { notes: { markdown: sizeModeMarkdown } },
};

export const CustomHeader = () => ({
  component: ModalContainerButtonStories,
});

CustomHeader.story = {
  parameters: { notes: { markdown: customHeaderModeMarkdown } },
};
