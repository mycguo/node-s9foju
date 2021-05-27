import { moduleMetadata } from '@storybook/angular';
import { OldSortableListComponent } from './old-sortable-list.component';

export default {
  title: 'Shared/Old Sortable List',

  decorators: [
    moduleMetadata({
      declarations: [OldSortableListComponent],
    }),
  ],
};

export const Default = () => {
  return {
    template: ``, // todo
  };
};
