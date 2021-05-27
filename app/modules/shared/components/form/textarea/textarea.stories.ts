import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared.module';
import { MatInputModule } from '@angular/material/input';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';

const baseNote = require('./notes/base.note.md');
const maxRowsNote = require('./notes/max-rows.note.md');
const minRowsNote = require('./notes/min-rows.note.md');

const inputModel = new SimpleInputModel(
  HtmlInputTypesEnum.textArea,
  'TextArea Label',
  'Placeholder TextArea'
);
const props = { formControl: new FormControl(), inputModel: inputModel };

export default {
  title: 'Shared/Form/Textarea',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule, MatInputModule],
    }),
  ],
};

export const Base = () => ({
  template: `<nx-textarea [formControl]="formControl" [inputModel]="inputModel"></nx-textarea>`,
  props: props,
});

Base.story = {
  parameters: { notes: { markdown: baseNote } },
};

export const MaxRows = () => ({
  template: `<nx-textarea [formControl]="formControl" [inputModel]="inputModel" [maxRows]="maxRows"></nx-textarea>`,
  props: {
    ...props,
    maxRows: 5,
    inputModel: { ...inputModel, label: 'Resize until 5 rows displayed' },
  },
});

MaxRows.story = {
  parameters: { notes: { markdown: maxRowsNote } },
};

export const MinRows = () => ({
  template: `<nx-textarea [formControl]="formControl" [inputModel]="inputModel" [minRows]="minRows"></nx-textarea>`,
  props: {
    ...props,
    minRows: 3,
    inputModel: { ...inputModel, label: 'Set 3 rows view' },
  },
});

MinRows.story = {
  parameters: { notes: { markdown: minRowsNote } },
};
