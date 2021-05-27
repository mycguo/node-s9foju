import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Component, Input, OnInit } from '@angular/core';
import GridColumn from '../../models/grid-column.model';
import GridData from '../../models/grid-data.model';
import { AgGridColumnFilterComponent } from '../filters/ag-grid-column-filter/ag-grid-column-filter.component';
import { GridComponent } from './grid.component';
import { GridTheme } from './themes/grid-theme.enum';
import { RowComponent } from '../../../shared/components/row/row.component';
import { ColComponent } from '../../../shared/components/col/col.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import GridCheckboxColumn from '../../models/grid-checkbox-column.model';
import GridGroupColumn from '../../models/grid-group-column';
import GridBaseColumn from '../../models/grid-base-column';

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
  return returnData;
})();

const mockDataB = (() => {
  const returnData = [];
  for (let i = 0; i < 200; i++) {
    const data: any = {};
    data.col1 = `text ${i}`;
    data.col2 = Math.random() * 30;
    returnData.push(data);
  }
  return returnData;
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

const mockGroupingColumns = (() => {
  const returnColumns: Array<GridBaseColumn> = [new GridCheckboxColumn()];
  returnColumns.push(
    new GridGroupColumn({
      name: 'ColG',
      children: [
        new GridColumn({
          name: `Col 1`,
          prop: `col1`,
          width: 200,
          sortable: true,
          tooltipField: `col1`,
          headerClass: 'ag-sub-header-cell',
        }),
        new GridColumn({
          name: `Col 2`,
          prop: `col2`,
          width: 200,
          sortable: true,
          tooltipField: `col2`,
          headerClass: 'ag-sub-header-cell ag-sub-header-cell_no-resize',
        }),
      ],
    })
  );
  for (let i = 3; i <= 20; i++) {
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
  returnColumns.push(
    new GridGroupColumn({
      name: 'ColG',
      children: [
        new GridColumn({
          name: `Col 1`,
          prop: `col1`,
          width: 200,
          sortable: true,
          tooltipField: `col1`,
          headerClass: 'ag-sub-header-cell',
        }),
        new GridColumn({
          name: `Col 2`,
          prop: `col2`,
          width: 200,
          sortable: true,
          tooltipField: `col2`,
          headerClass: 'ag-sub-header-cell ag-sub-header-cell_no-resize',
        }),
      ],
    })
  );
  return returnColumns;
})();

@Component({
  selector: 'nx-grid-container-mock',
  template: `
    <input (keyup)="applyHighlight($event)" placeholder="col1 highlight term" />
    <nx-grid
      [data]="data"
      [columns]="columns"
      [theme]="theme"
      [fullHeight]="true"
      [getIdFromDataItem]="getIdFromDataItem"
      [highlightIds]="highlightIds"
    ></nx-grid>
  `,
})
  // @ts-ignore
class GridContainerMock implements OnInit {
  // @ts-ignore
  @Input() theme: GridTheme = GridTheme.DEFAULT;
  data: GridData<any>;
  // @ts-ignore
  @Input() columns: Array<GridBaseColumn>;

  highlightIds: string[];

  ngOnInit(): void {
    this.data = { rows: mockData };
    if (!this.columns || this.columns.length === 0) {
      this.columns = mockColumns;
    }
  }

  applyHighlight(event: KeyboardEvent) {
    const search = (event.target as HTMLInputElement).value;
    this.highlightIds = this.data.rows.reduce((acc, row) => {
      if (search !== '' && row.col1.indexOf(search) > -1) {
        acc.push(row.col1);
      }
      return acc;
    }, []);
  }

  getIdFromDataItem(rowData): string {
    return rowData.col1;
  }
}

@Component({
  selector: 'nx-lightweight-grid-container-mock',
  template: `
    <div class="row">
      <div class="col col_w-66">
        <nx-card
          headerTitle="Without Rows Divider"
          [body]="bodyA"
          lightweight="true"
        >
          <ng-template #bodyA>
            <nx-grid
              [data]="dataA"
              [columns]="columnsA"
              [theme]="theme"
            ></nx-grid>
          </ng-template>
        </nx-card>
      </div>

      <div class="col col_w-33">
        <nx-card
          headerTitle="Has Rows Divider"
          [body]="bodyB"
          lightweight="true"
        >
          <ng-template #bodyB>
            <nx-grid
              [data]="dataB"
              [columns]="columnsB"
              [theme]="theme"
            ></nx-grid>
          </ng-template>
        </nx-card>
      </div>
    </div>
  `,
})
  // @ts-ignore
class LightweightGridContainerMock implements OnInit {
  // @ts-ignore
  @Input() theme: GridTheme = GridTheme.LIGHTWEIGHT;
  dataA: GridData<any>;
  dataB: GridData<any>;
  columnsA: Array<GridBaseColumn>;
  columnsB: Array<GridColumn>;

  ngOnInit(): void {
    this.dataA = { rows: mockData };
    this.dataB = { rows: mockDataB };
    this.columnsA = mockColumns;
    this.columnsB = [
      new GridColumn({
        name: `Col 1`,
        prop: `col1`,
        width: 200,
        sortable: true,
      }),
      new GridColumn({
        name: `Col 2`,
        prop: `col2`,
        width: 200,
        sortable: true,
        cellClass: 'ag-cell_number',
        headerClass: 'ag-header-cell_number',
      }),
    ];
  }
}

export default {
  title: 'Grid/GridComponent',

  decorators: [
    moduleMetadata({
      imports: [
        AgGridModule.withComponents([
          // GridFilterSelectComponent,
        ]),
        FormsModule,
      ],
      declarations: [
        AgGridColumnFilterComponent,
        GridContainerMock,
        LightweightGridContainerMock,
        GridComponent,
        RowComponent,
        ColComponent,
        CardComponent,
      ],
    }),
  ],
};

export const Default = () => {
  return {
    props: {},
    template: `
        <nx-grid-container-mock
        ></nx-grid-container-mock>
      `,
  };
};

export const LightweightView = () => {
  return {
    component: LightweightGridContainerMock,
  };
};

export const Grouping = () => {
  return {
    props: { columns: mockGroupingColumns, theme: GridTheme.GROUPED_DEFAULT },
    component: GridContainerMock,
  };
};
