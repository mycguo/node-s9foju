import {Injectable} from '@angular/core';
import {ReportTableDataStrategy} from '../report-table-data-strategy';
import {SummaryMetaElement} from '../../../../../reporting/models/api/response/sub/summary/summary-meta-element';
import {ReportAddlWidgetDataProviderService} from '../../../report-addl-widget-data-provider/report-addl-widget-data-provider.service';
import {DevicesService} from '../../../../../settings/services/devices/devices.service';
import DeviceNameInfo from '../../../../../reporting/models/api/response/device-name-info';
import ReportTableDataRow from '../../report-table-data-row';

@Injectable({
  providedIn: 'root'
})
export class DeviceStrategyService implements ReportTableDataStrategy {
  private static readonly DEVICE_SERIAL_KEY = 'DeviceSerial';

  constructor(private devicesService: DevicesService) {
  }

  modifyRow(flatRow: ReportTableDataRow): ReportTableDataRow {
    const deviceMetaData: SummaryMetaElement = flatRow[DeviceStrategyService.DEVICE_SERIAL_KEY] =
      flatRow.metaData.find((metaData: SummaryMetaElement) => {
        return metaData.field === ReportAddlWidgetDataProviderService.DEVICE_META_NAME;
      });
    const showSystemName: boolean = this.devicesService.shouldShowSystemName();
    const deviceInfo: DeviceNameInfo = deviceMetaData.value;
    flatRow[DeviceStrategyService.DEVICE_SERIAL_KEY] = showSystemName ? deviceInfo.systemName : deviceInfo.hostName;
    return flatRow;
  }
}
