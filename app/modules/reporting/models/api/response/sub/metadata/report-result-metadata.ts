import {ReportResultMetadataType} from '../../enums/report-result-metadata-type';

export default interface ReportResultMetadata <T> {
  field: ReportResultMetadataType;
  value: T;
}
