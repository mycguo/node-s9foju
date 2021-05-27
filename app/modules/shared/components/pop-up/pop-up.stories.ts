import { moduleMetadata } from '@storybook/angular';
import { Component, Inject, OnInit } from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import GridColumn from '../../../grid/models/grid-column.model';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import { AgGridModule, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { StatusIndicatorComponent } from '../status-indicator/status-indicator.component';
import { GridComponent } from '../../../grid/components/grid/grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PopUpService } from '../../services/pop-up/pop-up.service';
import { PopUpComponent } from './pop-up.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { POP_UP_DATA } from './const/pop-up.token';
import { PopUpRef } from './pop-up-ref';
import { UntilDestroy } from '@ngneat/until-destroy';
import { StatusCellRendererComponent } from '../../../grid/components/cell-renders/status-cell-renderer/status-cell-renderer.component';

interface CustomDataModel {
  status: string;
}

@UntilDestroy()
@Component({
  template: `
    <div class="nx-pop-up-container">
      <nx-spinner *ngIf="isLoadingState"></nx-spinner>
      <p style="white-space: nowrap" *ngIf="!isLoadingState">
        Status: {{ data.status }}
      </p>
      <p style="white-space: nowrap" *ngIf="!isLoadingState">
        Status: {{ data.status }}
      </p>
      <p style="white-space: nowrap" *ngIf="!isLoadingState">
        Status: {{ data.status }}
      </p>
      <p style="white-space: nowrap" *ngIf="!isLoadingState">
        Status: {{ data.status }}
      </p>
    </div>
  `,
})
class PopUpContentComponent extends PopUpComponent<CustomDataModel> {
  isLoadingState = true;
  constructor(
    public dialogRef: PopUpRef,
    @Inject(POP_UP_DATA) public data: CustomDataModel,
    public popUpService: PopUpService
  ) {
    super(dialogRef, data, popUpService);
    setTimeout(() => {
      this.isLoadingState = false;
      this.updatePosition();
    }, 2000);
  }
}

@Component({
  template: ` <nx-grid [data]="data" [columns]="columns"></nx-grid> `,
})
class BaseUsageComponent implements OnInit {
  data: GridData<any>;
  columns: Array<GridColumn>;

  constructor(public popUpService: PopUpService) {}

  private handleStatusCellClick($event): void {
    this.popUpService.open({
      origin: $event.event.target.hasAttribute('nx-status-indicator')
        ? $event.event.target
        : $event.event.target.querySelector('[nx-status-indicator]'),
      componentRef: PopUpContentComponent,
      data: {
        status: $event.data.status,
      },
    });
  }

  ngOnInit(): void {
    this.data = {
      rows: [
        {
          status: ConfigurationEnum.VALID,
        },
        {
          status: ConfigurationEnum.INVALID,
        },
      ],
    };

    this.columns = [
      new GridColumn({
        name: 'Status',
        prop: 'status',
        maxWidth: 140,
        cellRenderComponent: StatusCellRendererComponent,
        cellClass: 'ag-cell_align-center ag-cell_has-pointer-events',
        onCellClicked: this.handleStatusCellClick.bind(this),
      }),
    ];
  }
}

export default {
  title: 'Shared/Pop-Up',

  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        OverlayModule,
        AgGridModule.withComponents([
          StatusCellRendererComponent,
          PopUpComponent,
        ]),
      ],
      declarations: [
        GridComponent,
        BaseUsageComponent,
        StatusCellRendererComponent,
        StatusIndicatorComponent,
        SpinnerComponent,
        PopUpComponent,
        PopUpContentComponent,
      ],
    }),
  ],
};

export const Base = () => ({
  component: BaseUsageComponent,
});
