import LiveInsightEdgeDataPageState from '../live-insight-edge-data-page.state';
import {LiveInsightEdgeConnectionStatusModel} from '../../../../services/analytics-platform/connection/live-insight-edge-connection-status-model';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';

interface LiveInsightEdgePredictionsReportPageState extends LiveInsightEdgeDataPageState {
  isConnectionValid: boolean;
  connectionStatus: LiveInsightEdgeConnectionStatusModel;
  liveNaConnectionError: Error;
  liveNaConnectionCustomErrorMessage: LaNoDataMessage;
}

export default LiveInsightEdgePredictionsReportPageState;
