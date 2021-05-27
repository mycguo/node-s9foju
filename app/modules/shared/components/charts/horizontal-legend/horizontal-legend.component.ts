import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SeriesLegend} from './series-legend';
import HorizontalLegendPresenter from './horizontal-legend.presenter';


@Component({
  selector: 'nx-horizontal-legend',
  templateUrl: './horizontal-legend.component.html',
  styleUrls: ['./horizontal-legend.component.less'],
  viewProviders: [
    {
      provide: HorizontalLegendPresenter,
      useFactory: () => new HorizontalLegendPresenter()
    }
  ]
})
export class HorizontalLegendComponent implements OnChanges {

  @Input() seriesList = new Array<SeriesLegend>();

  @Output() seriesClicked = new EventEmitter<SeriesLegend>();


  styleMap: Record<string, any> = {};

  constructor(
    private horizontalLegendPresenter: HorizontalLegendPresenter
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.seriesList?.currentValue != null) {
      this.styleMap = this.horizontalLegendPresenter.updateStyleMap(this.seriesList);
    }
  }

  handleSeriesClick(series: SeriesLegend) {
    if (series.filterable) {
      this.seriesClicked.emit(series);
    }
  }

}
