import { GridStatusBarComponent } from './grid-status-bar.component';
import { GridStatusBar } from './grid-status-bar';

export default {
  title: 'Grid/GridStatusBarComponent',
};

export const Default = () => ({
  component: GridStatusBarComponent,
  props: {
    data: <GridStatusBar>{
      allRows: 20,
      filteredRows: 10,
      selectedRows: 15,
    },
  },
});

Default.story = {
  name: 'default',
};
