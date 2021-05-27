import SummaryDataElement from './summary-data-element';
import {SummaryMetaElement} from './summary-meta-element';

interface SummaryData {
  data: Array<SummaryDataElement>;
  key: Array<SummaryDataElement>;
  meta?: Array<SummaryMetaElement>;
}

export default SummaryData;
