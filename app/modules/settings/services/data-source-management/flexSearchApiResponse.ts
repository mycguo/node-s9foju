import {LivenxApiResponse} from '../../../shared/interfaces/livenxApiResponse';

/**
 * FlexSearchApiResponse
 *
 * @author Ryne Okimoto
 * @description REST API response for the /v1/reports/longTermReports/flexsearch endpoint
 */
export interface FlexSearchApiResponse extends LivenxApiResponse {
  flexSearch: string;
}
