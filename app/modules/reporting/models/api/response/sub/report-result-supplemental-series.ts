import SupplementalSeriesType from '../enums/supplemental-series-type';

interface ReportResultSupplementalSeries {
  label: string;
  type: SupplementalSeriesType;
  data: Array<Array<string | number>>;
}

export default ReportResultSupplementalSeries;
