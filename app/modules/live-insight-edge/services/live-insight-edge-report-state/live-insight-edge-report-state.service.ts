import {Injectable, OnDestroy} from '@angular/core';
import {Query, Store} from '@datorama/akita';
import ReportViewState from './report-view.state';
import {Observable} from 'rxjs';
import {ReportHiddenSeries} from './report-hidden-series';


@Injectable({
  providedIn: 'root'
})
export class LiveInsightEdgeReportStateService implements OnDestroy {

  private store: Store<ReportViewState>;
  private query: Query<ReportViewState>;

  constructor() {}

  initializeStore(reportId: string) {
    if (reportId == null) {
      throw new Error('reportId is null or undefined');
    }
    this.store = new Store<ReportViewState>({}, { name: `livena-report-state-${reportId}`});
    this.query = new Query<ReportViewState>(this.store);
  }

  isStoreInitialized(): boolean {
    return this.store != null;
  }

  selectReportState(): Observable<ReportViewState> {
    if (this.query == null) {
      throw new Error('initializeStore must be called before selecting report state.');
    }
    return this.query.select();
  }

  updateSeriesVisibility(hiddenSeries: ReportHiddenSeries) {
    this.store.update({hiddenSeries});
  }

  ngOnDestroy(): void {
    this.store.destroy();
  }
}
