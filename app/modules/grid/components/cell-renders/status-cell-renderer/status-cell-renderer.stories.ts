import { StatusIndicatorComponent } from '../../../../shared/components/status-indicator/status-indicator.component';
import ConfigurationEnum from '../../../../../../../../project_typings/enums/configuration.enum';
import { StatusCellRendererComponent } from './status-cell-renderer.component';
import { moduleMetadata } from '@storybook/angular';
import GridColumn from '../../../models/grid-column.model';
import { GridComponent } from '../../grid/grid.component';
import GridData from '../../../models/grid-data.model';
import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

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
        { status: ConfigurationEnum.VALID },
        { status: ConfigurationEnum.CONNECTED },
        { status: ConfigurationEnum.CONNECTING },
        { status: ConfigurationEnum.INVALID },
        { status: ConfigurationEnum.ERROR },
        { status: ConfigurationEnum.UNCONFIGURED },
        { status: ConfigurationEnum.OFFLINE },
        { status: ConfigurationEnum.DOWN },
        { status: ConfigurationEnum.UNKNOWN },
      ],
    };

    this.columns = [
      new GridColumn({
        name: 'Status',
        prop: 'status',
        maxWidth: 140,
        cellRenderComponent: StatusCellRendererComponent,
        cellClass: 'ag-cell_align-center',
      }),
    ];
  }
}

export default {
  title: 'Grid/Cell-Renders/Status',

  decorators: [
    moduleMetadata({
      imports: [AgGridModule.withComponents([StatusCellRendererComponent])],
      declarations: [
        GridContainerMock,
        GridComponent,
        StatusCellRendererComponent,
        StatusIndicatorComponent,
      ],
    }),
  ],
};

export const Connected = () => ({
  component: GridContainerMock,
  props: { value: ConfigurationEnum.CONNECTED },
});
