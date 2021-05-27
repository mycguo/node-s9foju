import SortOrder from './sort-order';
import LiveInsightEdgeDataPageState from '../live-insight-edge-data-page.state';
import {LiveInsightEdgeConnectionStatusModel} from '../../../../services/analytics-platform/connection/live-insight-edge-connection-status-model';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';

interface LiveInsightEdgeReportPageState extends LiveInsightEdgeDataPageState {
  isAnomaliesOnly: boolean;
  timeSortOrder: SortOrder;
  volumeSortOrder: SortOrder;
  isConnectionValid: boolean;
  connectionStatus: LiveInsightEdgeConnectionStatusModel;
  liveNaConnectionError: Error;
  liveNaConnectionCustomErrorMessage: LaNoDataMessage;
}

export default LiveInsightEdgeReportPageState;
