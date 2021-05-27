export default interface ReportResultTimeZoneMetadata {
  zoneId: string;
  displayName: string;
  standardOffset: number;
  currentOffset: number;
  supportsDst: boolean;
  isDstEnabled: boolean;
}
