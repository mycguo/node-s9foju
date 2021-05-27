import {LongTermReport} from '../../services/long-term-reports/long-term-report.model';
import {ToggleModel} from '../../../shared/components/form/toggle/models/toggle.model';

export interface LongTermReportsToggle extends LongTermReport {
  toggleModel: ToggleModel;
  disabled?: boolean;
}
