import SharingType from '../enums/sharing-type';

export interface ReportSharingConfig {
  attachCsv: boolean;
  attachPdf: boolean;
  pdfLimit: number | void;
  type: SharingType;
  value: string;
}
