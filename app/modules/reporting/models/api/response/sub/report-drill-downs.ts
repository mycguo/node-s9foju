interface ReportDrillDowns {
  drillDownsPerKey: Array<any>;
  reports: Array<{reportCategory: string, reportId: string}>;
}

export default ReportDrillDowns;
