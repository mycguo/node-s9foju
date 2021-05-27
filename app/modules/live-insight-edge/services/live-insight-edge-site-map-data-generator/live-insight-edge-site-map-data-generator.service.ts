import {Inject, Injectable, Optional, SkipSelf} from '@angular/core';
import {VisualDataGenerator} from '../../../dashboard/containers/dashboard-widget/visual-data-generator';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import {DivIcon, Marker, Point} from 'leaflet';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import {CommonService} from '../../../../utils/common/common.service';
import {MapMarker} from '../../../dashboard/components/dashboard-widget-map/model/map-marker';
import {Location} from '@angular/common';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import {FilterExpressionsService} from '../../../../services/filter-expressions/filter-expressions.service';
import {FlexFilterProvider, FlexFilterProviderToken} from '../../../../services/page-filter/flex-filter-provider.model';
import {PageInterlinkService} from '../../../../services/page-interlink/page-interlink.service';
import LaRouteService from '../../../../../../../client/app/services/laRouteService/laRouteService.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportResultState} from '../../../reporting/models/api/response/sub/report-result-state';

@Injectable({
  providedIn: 'any'
})
export class LiveInsightEdgeSiteMapDataGeneratorService implements VisualDataGenerator {

  constructor(
    private commonService: CommonService,
    private location: Location,
    private pageInterlinkService: PageInterlinkService,
    private filterExpressionsService: FilterExpressionsService,
    @Optional() @SkipSelf() @Inject(FlexFilterProviderToken) private filterStateProvider: FlexFilterProvider
  ) { }

  buildConfig(buildFrom: ReportResponse): any {
    return {}; // no explicit config based on data needed at this time
  }

  setOptions(options: any): void {
  }

  transformData(data: Array<ReportResult>): Array<Marker> {
    if (data == null || data.length === 0 ||
      data[0].summary?.summaryData.length === 0) {
      return [];
    }

    const firstResult = data[0];
    const rowData = firstResult?.summary?.summaryData;
    if (rowData == null) {
      return [];
    }

    const flexFilters = this.filterStateProvider?.getFlexSearchState() ?? [];
    const reportPage = LaRouteService.routes.liveInsightEdgeReports.getFullPath();

    const siteMarkers = rowData.map((row) => {
      const metadata = row.meta;
      if (this.commonService.isNil(metadata)) {
        return null;
      }
      // geolocation defined by server response
      const geolocation = metadata.find((meta) => meta.field === 'geolocation');
      if (geolocation == null) {
        return null;
      }
      const latitude = geolocation.value?.latitude;
      const longitude = geolocation.value?.longitude;

      const siteMetadata = metadata.find((meta) => meta.field === 'site');
      const {id: siteId, name: siteName} = siteMetadata.value;

      const icon = new DivIcon({
        html: `<div>${siteName}</div>`,
        className: 'nx-map-marker-icon',
        iconSize: new Point(16, 16)
      });

      const filterFromSelf = { key: LaFilterSupportEnums.SITE, values: [siteName]};
      const combinedFilters = this.filterExpressionsService.combineFilterExpressions(flexFilters,
        [filterFromSelf]);
      const href = !this.commonService.isNil(siteName) ?
        this.pageInterlinkService.createHref(reportPage, combinedFilters) : null;

      return new MapMarker(
        [latitude, longitude],
        {icon: icon, title: siteName},
        {id: siteId, name: siteName})
        .on('click', () => {
          this.location.go(href);
        });
    });
    return this.commonService.removeNil(siteMarkers);
  }

  generateError(data: any): DetailedError {
    const firstResult = data[0];
    if (firstResult == null) {
      return <DetailedError> {
        message: 'Result data can not be fond in the response.'
      };
    }
    if (firstResult.state === ReportResultState.FAILED) {
      return firstResult.error;
    }
    return null;
  }
}
