import {Component, Inject, OnInit} from '@angular/core';
import {$STATE} from '../../ajs-upgraded-providers';
import {downgradeComponent} from '@angular/upgrade/static';

@Component({
  selector: 'nx-live-insight-edge-summary-page',
  templateUrl: './live-insight-edge-summary-page.component.html',
  styleUrls: ['./live-insight-edge-summary-page.component.less']
})
export class LiveInsightEdgeSummaryPageComponent implements OnInit {

  constructor(
    @Inject($STATE) private $state: any
  ) { }

  ngOnInit(): void {
  }

}
