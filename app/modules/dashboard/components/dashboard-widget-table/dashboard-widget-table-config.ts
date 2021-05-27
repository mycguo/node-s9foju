import GridColumn from '../../../grid/models/grid-column.model';
import {GridTheme} from '../../../grid/components/grid/themes/grid-theme.enum';
import GridBaseColumn from '../../../grid/models/grid-base-column';

export interface DashboardWidgetTableConfig {
  columns: Array<GridBaseColumn>;
  theme: GridTheme;
  noRowsDivider?: boolean;
  autoSizeColsSkipHeader?: boolean;
}
