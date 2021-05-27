import { StatusIndicatorValues } from '../../../shared/components/status-indicator/enums/status-indicator-values.enum';
import { StatusIndicatorComponent } from '../../../shared/components/status-indicator/status-indicator.component';
import { PopUpComponent } from '../../../shared/components/pop-up/pop-up.component';
import { PopUpService } from '../../../shared/services/pop-up/pop-up.service';
import { IpslaStatusPopUpComponent } from './ipsla-status-pop-up.component';
import GridColumn from '../../../grid/models/grid-column.model';
import { moduleMetadata } from '@storybook/angular';
import GridData from '../../../grid/models/grid-data.model';
import { Component, OnInit } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import { GridComponent } from '../../../grid/components/grid/grid.component';
import { StatusCellRendererComponent } from '../../../grid/components/cell-renders/status-cell-renderer/status-cell-renderer.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { KeyValueListComponent } from '../../../shared/components/key-value-list/key-value-list.component';
import { KeyValueListItemDirective } from '../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';
import { IpslaTestStatusPopUpData } from './interfaces/ipsla-test-status-pop-up-data';

@Component({
  selector: 'nx-ipsla-status-pop-up-host',
  template: ` <nx-grid [data]="data" [columns]="columns"></nx-grid> `,
})
  // @ts-ignore
class IpslaStatusPopUpHostComponent implements OnInit {
  data: GridData<IpslaTestStatusPopUpData>;
  columns: Array<GridColumn>;

  constructor(public popUpService: PopUpService) {}

  private handleStatusCellClick($event): void {
    this.popUpService.open({
      origin: $event.event.target.hasAttribute('nx-status-indicator')
        ? $event.event.target
        : $event.event.target.querySelector('[nx-status-indicator]'),
      componentRef: IpslaStatusPopUpComponent,
      data: $event.data,
    });
  }

  ngOnInit(): void {
    this.data = {
      rows: [
        {
          status: StatusIndicatorValues.VALID,
          testName: 'Jitter',
          drilldown: '/',
          testStatus: StatusIndicatorValues.VALID,
          testStatusReason: 'Packet loss threshold exceeded',
        },
        {
          status: StatusIndicatorValues.VALID,
          testName: 'ICMP Echo',
          drilldown: '/',
          testStatus: StatusIndicatorValues.VALID,
          testStatusReason: 'Ok',
        },
        {
          status: StatusIndicatorValues.INVALID,
          testName: 'Jitter',
          drilldown: '/',
          testStatus: StatusIndicatorValues.INVALID,
          testStatusReason: void 0,
        },
        {
          status: StatusIndicatorValues.NA,
          testName: 'ICMP Echo',
          drilldown: '/',
          testStatus: StatusIndicatorValues.NA,
          testStatusReason: void 0,
        },
      ],
    };

    this.columns = [
      new GridColumn({
        name: 'Test Status',
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
  title: 'Story/IP SLA/Test Status Pop-Up',

  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        OverlayModule,
        AgGridModule.withComponents([
          StatusCellRendererComponent,
          PopUpComponent,
          CardComponent,
        ]),
      ],
      declarations: [
        GridComponent,
        IpslaStatusPopUpHostComponent,
        StatusCellRendererComponent,
        StatusIndicatorComponent,
        CardComponent,
        IpslaStatusPopUpComponent,
        KeyValueListComponent,
        KeyValueListItemDirective,
      ],
      providers: [PopUpService],
    }),
  ],
};

export const Default = () => ({
  component: IpslaStatusPopUpHostComponent,
});

Default.story = {
  name: 'default',
};
