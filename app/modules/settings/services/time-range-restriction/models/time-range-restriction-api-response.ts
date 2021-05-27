import {TimeRangeRestrictionOption} from '../../../components/time-range-restriction-setting/models/time-range-restriction-option';

export interface TimeRangeRestrictionApiResponse {
  selectedTimeRangeId: string;
  timeRanges: Array<TimeRangeRestrictionOption>;
}
