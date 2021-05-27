export interface ReportRequestTimeZone {
  id: string;
  enableDst: boolean;
  supportsDst?: boolean;
  standardOffset?: number;
}
