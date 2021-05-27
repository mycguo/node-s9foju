import { moduleMetadata } from '@storybook/angular';
import { DashboardWidgetFilteredTableComponent } from './dashboard-widget-filtered-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import GridColumn from '../../../grid/models/grid-column.model';
import { GridModule } from '../../../grid/grid.module';
import { DashboardWidgetFilteredTableConfig } from './dashboard-widget-filtered-table-config';
import { GridTheme } from '../../../grid/components/grid/themes/grid-theme.enum';

const mockData = (() => {
  const returnData = [];
  for (let i = 0; i < 1000; i++) {
    const data: any = {};
    data.col1 = `text ${i}`;
    data.col2 = `Category ${i % 20}`;
    for (let j = 3; j <= 20; j++) {
      data[`col${j}`] = Math.random() * 30;
    }
    returnData.push(data);
  }
  return { rows: returnData };
})();

const mockColumns = (() => {
  const returnColumns = [new GridCheckboxColumn()];
  for (let i = 1; i <= 20; i++) {
    const column = new GridColumn({
      name: `Col ${i}`,
      prop: `col${i}`,
      width: 200,
      sortable: true,
      tooltipField: `col${i}`,
    });
    if (i > 2) {
      column.cellClass = 'ag-cell_number';
    }
    returnColumns.push(column);
  }
  return returnColumns;
})();

export default {
  title: 'Dashboard/DashboardWidgetFilteredTableComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, GridModule, SharedModule],
    }),
  ],
};

export const Default = () => ({
  component: DashboardWidgetFilteredTableComponent,
  props: {
    data: mockData,
    config: {
      theme: GridTheme.DEFAULT,
      columns: mockColumns,
    } as DashboardWidgetFilteredTableConfig,
  },
});

Default.story = {
  name: 'default',
};
