import {Component, Input, OnInit} from '@angular/core';
import {DashboardWidgetConfig} from '../../../dashboard/components/dashboard-widget/dashboard-widget-config';
import DetailedError from '../../../shared/components/loading/detailed-error';

@Component({
  selector: 'nx-ipsla-story-tab',
  templateUrl: './ipsla-story-tab.component.html',
  styleUrls: ['./ipsla-story-tab.component.less']
})
export class IpslaStoryTabComponent implements OnInit {
  @Input() tableWidget: DashboardWidgetConfig;
  @Input() error: DetailedError;
  @Input() widgetId: string;

  constructor() { }

  ngOnInit(): void {
  }

}
