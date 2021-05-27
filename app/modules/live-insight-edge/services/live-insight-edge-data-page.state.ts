import {FlexFilterExpressionModel} from '../../../services/page-filter/flex-filter-expression.model';
import {LiveInsightEdgeSummaryViewPreferences} from '../components/live-insight-edge-summary/live-insight-edge-summary-view-preferences';
import {LaNoDataMessage} from '../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';

interface LiveInsightEdgeDataPageState {
  startTimeMillis: number;
  endTimeMillis: number;
  /**
   * Flex filters are their own string interpreter,
   * so we need to have both the string and objects persisted.
   */
  flexFilters: Array<FlexFilterExpressionModel>;
  flexFilterString: string;
  isLiveNaConnectionChecked: boolean;
  liveNaConnectionError: Error;
  liveNaConnectionCustomErrorMessage: LaNoDataMessage;
  viewPreferences: LiveInsightEdgeSummaryViewPreferences;
}

export default LiveInsightEdgeDataPageState;
