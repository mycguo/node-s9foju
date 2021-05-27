import { ErrorCellRendererComponent } from './error-cell-renderer.component';
import { ErrorCellValue } from './enums/error-cell-value.enum';
import { moduleMetadata } from '@storybook/angular';
import GridColumn from '../../../models/grid-column.model';
import { GridComponent } from '../../grid/grid.component';
import GridData from '../../../models/grid-data.model';
import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { UpperFirstPipe } from '../../../../shared/pipes/upper-first/upper-first.pipe';

@Component({
  selector: 'nx-grid-container-mock',
  template: `<nx-grid [data]="data" [columns]="columns"></nx-grid>`,
})
class GridContainerMock implements OnInit {
  data: GridData<any>;
  columns: Array<GridColumn>;

  ngOnInit(): void {
    this.data = {
      rows: [
        { error: ErrorCellValue.SUCCESS },
        { error: 'TIMEOUT' },
        { error: 'NOT_CONNECTED' },
        { error: ErrorCellValue.OTHER },
      ],
    };

    this.columns = [
      new GridColumn({
        name: 'Error',
        prop: 'error',
        maxWidth: 140,
        cellRenderComponent: ErrorCellRendererComponent,
      }),
    ];
  }
}

export default {
  title: 'Grid/Cell-Renders/Error',

  decorators: [
    moduleMetadata({
      imports: [AgGridModule.withComponents([ErrorCellRendererComponent])],
      declarations: [
        GridContainerMock,
        GridComponent,
        ErrorCellRendererComponent,
        UpperFirstPipe,
      ],
      providers: [UpperFirstPipe],
    }),
  ],
};

export const Base = () => ({
  component: GridContainerMock,
});
