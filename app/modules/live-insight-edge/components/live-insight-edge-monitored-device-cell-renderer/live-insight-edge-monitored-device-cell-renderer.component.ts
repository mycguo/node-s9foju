import {Component, Input, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'nx-live-insight-edge-monitored-device-cell-renderer',
  templateUrl: './live-insight-edge-monitored-device-cell-renderer.component.html',
  styleUrls: ['./live-insight-edge-monitored-device-cell-renderer.component.less']
})
export class LiveInsightEdgeMonitoredDeviceCellRendererComponent implements OnInit, ICellRendererAngularComp {

  value: string;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: ICellRendererParams) {
    this.value = params.value.label;
  }

  refresh(params: any): boolean {
    return false;
  }

}
