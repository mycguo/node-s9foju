import { moduleMetadata } from '@storybook/angular';
import { SortableListComponent } from './sortable-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

export default {
  title: 'Shared/SortableListComponent',

  decorators: [
    moduleMetadata({
      imports: [DragDropModule],
      declarations: [SortableListComponent],
    }),
  ],
};

export const Default = () => ({
  template: `<nx-sortable-list [items]='items'>
                 <ng-template let-item let-index='index'>
                  <div>{{item.name}}</div>
                 </ng-template>
               </nx-sortable-list>`,
  props: {
    items: [{ name: 'test 1' }, { name: 'test 2' }, { name: 'test 3' }],
  },
});

Default.story = {
  name: 'default',
};
