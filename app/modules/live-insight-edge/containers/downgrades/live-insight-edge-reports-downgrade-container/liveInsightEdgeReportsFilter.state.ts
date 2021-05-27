import LaFilterResult from '../../../../../../../../client/nxComponents/components/laFilterBuilder/models/laFilterResult';

export interface LiveInsightEdgeReportsFilterState {
  // isAnomaliesOnly: boolean;
  /**
   * True indicates that this is the initial page load state. No action should be taken until the filter state resolves.
   */
  initialLoad: boolean;
  filter: LaFilterResult;
}
