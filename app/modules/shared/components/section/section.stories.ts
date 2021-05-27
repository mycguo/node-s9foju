import { moduleMetadata } from '@storybook/angular';
import { SectionComponent } from './section.component';
import { ColComponent } from '../col/col.component';
import { RowComponent } from '../row/row.component';

const baseMarkdown = require('./notes/base.notes.md');
const withoutSeparatorMarkdown = require('./notes/without-separator.notes.md');

export default {
  title: 'Shared/SectionComponent',

  decorators: [
    moduleMetadata({
      declarations: [SectionComponent, RowComponent, ColComponent],
    }),
  ],
};

export const Base = () => ({
  template: `
        <nx-section titleText="Section A">Content</nx-section>
        <nx-section titleText="Section B">
            <div class="row"><div class="col col_w-50">Column</div><div class="col col_w-50">Column</div></div>
            <div class="row"><div class="col col_w-50">Column</div><div class="col col_w-50">Column</div></div>
        </nx-section>
      `,
});

Base.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};

export const WithoutHeaderSeparator = () => ({
  template: `
        <nx-section titleText="Section A" hasHeaderSeparator="false">
            <div class="row row_has-bg"><div class="col col_w-50">Column</div><div class="col col_w-50">Column</div></div>
        </nx-section>
        <nx-section titleText="Section B" hasHeaderSeparator="false">
            <div class="row row_has-bg"><div class="col col_w-50">Column</div><div class="col col_w-50">Column</div></div>
            <div class="row row_has-bg"><div class="col col_w-50">Column</div><div class="col col_w-50">Column</div></div>
        </nx-section>
      `,
});

WithoutHeaderSeparator.story = {
  name: 'Without header separator',
  parameters: { notes: { markdown: withoutSeparatorMarkdown } },
};
