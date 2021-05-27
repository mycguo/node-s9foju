import {Inject, Injectable, Optional, SkipSelf} from '@angular/core';
import {FlexFilterProvider, FlexFilterProviderToken} from '../../../../services/page-filter/flex-filter-provider.model';
import {PageInterlinkService} from '../../../../services/page-interlink/page-interlink.service';
import {FilterExpressionsService} from '../../../../services/filter-expressions/filter-expressions.service';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import {LinkCellValue} from '../../../grid/components/cell-renders/link-cell-renderer/link-cell-value';
import LaRouteService from '../../../../../../../client/app/services/laRouteService/laRouteService.service';
import {CommonService} from '../../../../utils/common/common.service';
import {ReportStringLabels} from '../../../reporting/constants/report-string-labels.enum';
import {FilterExpression} from '../../../../services/page-filter/filter-expression.model';

@Injectable({
  providedIn: 'any'
})
export class RowDataGeneratorService {

  constructor(
    private pageInterlinkService: PageInterlinkService,
    private filterExpressionsService: FilterExpressionsService,
    private commonService: CommonService,
    @Optional() @SkipSelf() @Inject(FlexFilterProviderToken) private filterStateProvider: FlexFilterProvider,
  ) { }

  createFilterableLink(
      rowData: {[key: string]: any},
      resolveRowKeyText: (rowData: {[key: string]: any}) => string,
      // rowFilterFieldKey: string,
      filterFromSelf: Array<FilterExpression>): LinkCellValue {
  if (rowData == null) {
      return null;
    }
    // get current flex search state
    const flexFilters = this.filterStateProvider?.getFlexSearchState() ?? [];
    // get path to drilldown page
    const reportPage = LaRouteService.routes.liveInsightEdgeReports.getFullPath();
    // combined filter expression including self
    const combinedFilters = this.filterExpressionsService
      .combineFilterExpressions(flexFilters, filterFromSelf);

    // create link
    const href = !this.commonService.isNil(filterFromSelf) ?
      this.pageInterlinkService.createHref(reportPage,
      combinedFilters) : null;

    const titleValue = resolveRowKeyText(rowData);

    // update name key based on what was set through name key
    const linkValue = !this.commonService.isNil(titleValue) ?
      <LinkCellValue> { text: titleValue, link: href} :
      <LinkCellValue> { text: ReportStringLabels.OTHER};
    return linkValue;
  }

}
