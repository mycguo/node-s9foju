import {Injectable} from '@angular/core';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import {DashboardWidgetTableConfig} from '../../components/dashboard-widget-table/dashboard-widget-table-config';
import GridColumn from '../../../grid/models/grid-column.model';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import {ReportTableDataGeneratorOptions} from './report-table-data-generator-options';
import {GridTheme} from '../../../grid/components/grid/themes/grid-theme.enum';
import {ReportResultState} from '../../../reporting/models/api/response/sub/report-result-state';
import DetailedError from '../../../shared/components/loading/detailed-error';
import ReportResponseSummaryField from '../../../reporting/models/api/response/sub/summary/report-response-summary-field';
import ReportTableDataRow from './report-table-data-row';
import SummaryData from '../../../reporting/models/api/response/sub/summary/summary-data';
import {ReportCustomGridColumn} from '../report-custom-grid-column/report-custom-grid-column.service';
import {ReportTableDataGeneratorOptionsColumn} from './report-table-data-generator-options-column';
import GridGroupColumn from '../../../grid/models/grid-group-column';
import GridBaseColumn from '../../../grid/models/grid-base-column';

@Injectable({
  providedIn: 'root'
})
export class ReportTableDataGeneratorService<T extends ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn> =
  ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn>> implements VisualDataGenerator
    <ReportResponse, DashboardWidgetTableConfig, Array<ReportResult>, Array<ReportTableDataRow>, T> {

  options: T;

  constructor(private customGridColumn: ReportCustomGridColumn) {
  }

  setOptions(options: T): void {
    this.options = options;
  }

  buildConfig(buildFrom: ReportResponse): DashboardWidgetTableConfig {
    const config: DashboardWidgetTableConfig = {columns: [], theme: GridTheme.DEFAULT};
    if (buildFrom?.results == null || buildFrom.results.length === 0 ||
      buildFrom.results[0]?.results == null ||
      buildFrom.results[0].results.length === 0 ||
      buildFrom.results[0]?.results[0]?.summary == null) {
      return config;
    }
    // Only take first report table.
    const summaryFields: Array<ReportResponseSummaryField> = buildFrom.results[0]?.results[0]?.summary.fields ?? [];
    const hiddenColumns: Array<string> = this.options?.hiddenColumns ?? [];
    const groupedOptions: Array<{ name: string, props: Array<string> }> = this.options?.grouped ?? [];
    const columns: Array<GridBaseColumn> = [];
    const groupMap = new Map<string, string>();
    // create mapping of fields to group name once upfront
    groupedOptions.forEach((grouped: { name: string, props: Array<string> }) => {
      grouped.props.forEach((prop: string) => {
        groupMap.set(prop, grouped.name);
      });
    });
    summaryFields.forEach((field: ReportResponseSummaryField) => {
      if (!hiddenColumns.includes(field.name)) {
        const columnGroupName = groupMap.get(field.name);
        // grouped
        if (columnGroupName != null) {
          config.theme = GridTheme.GROUPED_DEFAULT; // set theme to grouped
          // look for existing group in array
          const existingGroup: GridGroupColumn = <GridGroupColumn>columns.find((col: GridBaseColumn) => col.name === columnGroupName);
          if (existingGroup != null) {
            existingGroup.children.push(this.buildColumnByField(field, true));
          } else {
            columns.push(this.buildGroupedColumn(columnGroupName, [this.buildColumnByField(field, true)]));
          }
        } else {
          columns.push(this.buildColumnByField(field));
        }
      }
    });
    config.columns = columns;
    // ensure last column in group has correct class
    columns.map((col: GridBaseColumn) => {
      if (col instanceof GridGroupColumn) {
        col.children[col.children.length - 1].headerClass += ' ag-sub-header-cell_no-resize';
      }
      return col;
    });
    config.columns = columns;


    // Renderers will be based need to specified by specific data generator.
    if (this.options?.additionalColumns != null) {
      this.options.additionalColumns
        .sort((a: { prop: string, index: number }, b: { prop: string, index: number }) => {
          return a.index - b.index;
        })
        .forEach((addlColumnInfo: { prop: string, index: number }) => {
          const customGridColumnOption: ReportTableDataGeneratorOptionsColumn = this.options?.columns?.[addlColumnInfo.prop];
          const addlColumns = this.customGridColumn.buildColumn(
            addlColumnInfo.prop,
            addlColumnInfo.prop,
            customGridColumnOption,
            this.options);
          config.columns.splice(addlColumnInfo.index, 0, addlColumns);
        });
    }
    return config;
  }

  transformData(data: Array<ReportResult>,
                flattenMetadata: boolean = false): Array<ReportTableDataRow> {
    let gridData = [];
    if (data == null || data.length === 0 ||
      (data[0].summary?.summaryData?.length ?? 0) === 0) {
      gridData = [];
      return gridData;
    }

    const firstResult = data[0];

    if (firstResult != null) {
      if (firstResult.state === ReportResultState.FAILED) {
        throw firstResult.error;
      }
      const keyInfoElementMap = {};
      for (const field of firstResult?.summary?.fields ?? []) {
        keyInfoElementMap[field.id] = field.name;
      }

      gridData = firstResult.summary
        .summaryData.map((row: SummaryData) => {
          let flatRow = new ReportTableDataRow();
          const rowMeta = row.meta != null ? [...row.meta] : null;
          for (const colVal of row.data) {
            flatRow[keyInfoElementMap[colVal.infoElementId]] = colVal.value;
          }
          // flatten metadata
          if (flattenMetadata && rowMeta != null) {
            for (const meta of rowMeta) {
              const rowMetaValues = meta.value;
              for (const metaValueKey of Object.keys(rowMetaValues)) {
                flatRow[metaValueKey] = rowMetaValues[metaValueKey];
              }
            }
          }
          flatRow.metaData = rowMeta;
          if (this.options.visualDataStrategy != null) {
            flatRow = this.options.visualDataStrategy.modifyRow(flatRow);
          }
          return flatRow;
        });
    }

    return gridData;
  }

  generateError(data: Array<ReportResult>): DetailedError {
    const firstResult = data[0];
    if (firstResult == null) {
      return <DetailedError>{
        message: 'Result data can not be found in the response.'
      };
    }
    if (firstResult.state === ReportResultState.FAILED) {
      return new DetailedError('', firstResult?.error?.userMessage ?? 'Report Failed');
    }
    return null;
  }

  /**
   * Builds a grid column based on infoElementType or by override
   */
  private buildColumnByField(field: ReportResponseSummaryField, isGrouped = false): GridColumn {
    const customGridColumnOption: ReportTableDataGeneratorOptionsColumn = {
      ...this.customGridColumn.getGridColumnByInfoElementType(field),
      ...this.options?.columns?.[field.name] ?? {}
    };

    const column = this.customGridColumn.buildColumn(field.name, field.label, customGridColumnOption, this.options);
    column.headerClass = column.headerClass ?? ''; // initialize string;
    // NOTE if report supports infoElementType getGridColumnByInfoElementType should set class properly
    // rightAligned should only be used for older reports that do not support infoElementType, or non-numbered infoElementTypes
    if (this.options?.columns?.[field.name]?.rightAligned) {
      column.cellClass += ' ag-cell_number';
      column.headerClass += ' ag-header-cell_number';
    }
    if (isGrouped) {
      column.headerClass += ' ag-sub-header-cell';
    }
    return column;
  }

  private buildGroupedColumn(groupName: string, children: Array<GridColumn> = [], headerClass?: string): GridGroupColumn {
    return new GridGroupColumn({
      name: groupName,
      children: children,
      headerClass: headerClass
    });
  }
}
