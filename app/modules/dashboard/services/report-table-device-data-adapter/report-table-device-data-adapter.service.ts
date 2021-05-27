import { Injectable } from '@angular/core';
import {ReportTableDataRowField} from '../report-table-config-generator/report-table-data-row-field';
import ReportTableDataDeviceRow from '../report-table-config-generator/report-table-data-device-row';
import {ReportTableDataApplicationRow} from '../report-table-config-generator/report-table-data-application-row';

@Injectable({
  providedIn: 'root'
})
export class ReportTableDeviceDataAdapterService {

  constructor() { }

  getDeviceLabel(shouldUseSystemName: boolean, rowData: ReportTableDataDeviceRow) {
    return shouldUseSystemName ?
      rowData[ReportTableDataRowField.SYSTEM_NAME] :
      rowData[ReportTableDataRowField.HOST_NAME];
  }

  buildApplicationLabel(rowData: ReportTableDataApplicationRow): string {
    const appGroupName = rowData[ReportTableDataRowField.APP_GROUP];
    const appName = rowData[ReportTableDataRowField.APPLICATION_NAME];
    if (appName == null) {
      return appName;
    }
    const titleString = appGroupName != null ?
      `${appName} (${appGroupName})` :
      `${appName}`;
    return titleString;
  }
}
