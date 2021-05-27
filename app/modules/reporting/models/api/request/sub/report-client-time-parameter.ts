// This is what the NX Server expects
export interface ReportClientTimeParameter {
  timeZone?: TimeZoneRequest;
  relativeQueryTime?: number; // Long - milliseconds
  customTime?: boolean;
  startTimeInMillis?: number; // Long - milliseconds
  endTimeInMillis?: number; // Long - milliseconds
  // comparisonMonth?: string // <Month YYYY> e.g. "January 2012"
}

export interface TimeZoneRequest {
  id: string;
  enableDst: boolean;
}
