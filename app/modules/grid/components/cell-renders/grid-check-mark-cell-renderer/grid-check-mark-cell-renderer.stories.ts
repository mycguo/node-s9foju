import { GridCheckMarkCellRendererComponent } from './grid-check-mark-cell-renderer.component';

export default {
  title: 'Grid/Cell-Renders/GridCheckMarkCellRendererComponent',
};

export const Default = () => ({
  component: GridCheckMarkCellRendererComponent,
  props: { value: true },
});

Default.story = {
  name: 'default',
};
