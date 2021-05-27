import {StatusIndicatorValues} from '../../../modules/shared/components/status-indicator/enums/status-indicator-values.enum';

export interface LiveInsightEdgeConnectionStatusModel {
  status: StatusIndicatorValues;
  message?: string;
}
