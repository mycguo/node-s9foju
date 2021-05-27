import SummaryDataElement from './summary/summary-data-element';

interface ReportResponseSeries {
  key: Array<SummaryDataElement>;
  data: Array<Array<string | number>>;
}

export default ReportResponseSeries;
