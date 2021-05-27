import ReportDirectionParameter from '../../parameter-enums/report-direction-parameter';
import ReportSortByParameter from '../../parameter-enums/report-sort-by-parameter';
import ReportExecutionTypeParameter from '../../parameter-enums/report-execution-type-parameter';
import ReportFlowTypeParameter from '../../parameter-enums/report-flow-type-parameter';
import {ReportIpslaStatAggregationType} from '../../parameter-enums/report-ipsla-stat-aggregation-type.enum';
import {ReportIpslaType} from '../../parameter-enums/report-ipsla-type.enum';

export default interface ReportRequestParameters {
  endTime?: number | string;
  startTime?: number | string;
  flexSearch?: string;
  direction?: ReportDirectionParameter;
  displayFilter?: string;
  binDuration?: string;
  sortBy?: ReportSortByParameter;
  site?: string;
  site1?: string;
  site2?: string;
  executionType?: ReportExecutionTypeParameter;
  businessHours?: string;
  flowType?: ReportFlowTypeParameter;
  interface?: string;
  deviceSerial?: string;
  slaClass?: string;
  sourceServiceProvider?: string;
  destinationServiceProvider?: string;
  sourceSite?: string;
  getStatus?: boolean;
  destinationSite?: string;
  serviceProvider?: string;
  topAnalysisLimit?: number;
  ipslaStatAggregationType?: ReportIpslaStatAggregationType;
  ipslaType?: ReportIpslaType;
  testId?: string;
}
