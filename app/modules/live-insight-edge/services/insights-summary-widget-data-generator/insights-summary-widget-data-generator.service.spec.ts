import { TestBed } from '@angular/core/testing';

import { InsightsSummaryWidgetDataGeneratorService } from './insights-summary-widget-data-generator.service';
import ReportTableDataRow from '../../../dashboard/services/report-table-config-generator/report-table-data-row';
import {ReportResultMetadataType} from '../../../reporting/models/api/response/enums/report-result-metadata-type';
import {InsightType} from './insight-type';
import {SummaryMetaElement} from '../../../reporting/models/api/response/sub/summary/summary-meta-element';
import {ReportTableDataRowField} from '../../../dashboard/services/report-table-config-generator/report-table-data-row-field';

describe('InsightsSummaryWidgetDataGeneratorService', () => {
  let service: InsightsSummaryWidgetDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsightsSummaryWidgetDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide application link text', () => {
    const row = new ReportTableDataRow();
    expect(() => {
      service.buildApplicationLinkText(row);
    }).not.toThrow();
    row[ReportTableDataRowField.APPLICATION_NAME] = 'AppName';
    expect(() => {
      service.buildApplicationLinkText(row);
    }).not.toThrow();
    row[ReportTableDataRowField.APP_GROUP] = 'Group Name';
    expect(() => {
      service.buildApplicationLinkText(row);
    }).not.toThrow();
    row[ReportTableDataRowField.SITE_NAME] = 'Site';
    const linkText = service.buildApplicationLinkText(row);
    expect(linkText).toBe('Application AppName (Group Name) showing anomalies at Site');
  });

  it('should provide service provider link text', () => {
    const row = new ReportTableDataRow();
    expect(() => {
      service.buildBandwidthServiceProviderLinkText(row);
    }).not.toThrow();
    row[ReportTableDataRowField.SERVICE_PROVIDER] = 'Service Provider';
    expect(() => {
      service.buildBandwidthServiceProviderLinkText(row);
    }).not.toThrow();
    row[ReportTableDataRowField.SITE_NAME] = 'Site';
    expect(() => {
      service.buildBandwidthServiceProviderLinkText(row);
    }).not.toThrow();
    const linkText = service.buildBandwidthServiceProviderLinkText(row);
    expect(linkText).toBe('The Service Provider interface is showing anomalies at the site Site');
  });

  it('should provide device and interface link text', () => {
    const row = new ReportTableDataRow();
    expect(() => {
      service.buildBandwidthInterfaceLinkText(row);
    }).not.toThrow();
    service.setOptions({ useSystemName: true });
    row[ReportTableDataRowField.SYSTEM_NAME] = 'Device.System';
    row[ReportTableDataRowField.HOST_NAME] = 'Device.HostName';
    row[ReportTableDataRowField.INTERFACE_NAME] = 'Interface';
    expect(() => {
      service.buildBandwidthInterfaceLinkText(row);
    }).not.toThrow();
    row[ReportTableDataRowField.SITE_NAME] = 'Site';
    expect(() => {
      service.buildBandwidthInterfaceLinkText(row);
    }).not.toThrow();
    const linkText = service.buildBandwidthInterfaceLinkText(row);
    expect(linkText).toBe('The Device.System \u2192 Interface interface is ' +
      'showing anomalies at the site Site');
  });

  it ('should determine the InsightType from row', () => {
    const rowWithMeta = new ReportTableDataRow();
    rowWithMeta.metaData = [];
    rowWithMeta.metaData.push({
      field: ReportResultMetadataType.INSIGHT_KEY,
      value: {
        key: InsightType.APPLICATION
      }
    } as SummaryMetaElement);
    const insightTypeFromMeta = service.getInsightType(rowWithMeta);
    expect(insightTypeFromMeta).toBe(InsightType.APPLICATION);
  });

  it('should handle an unknown insight type', () => {
    const rowWithoutInsight = new ReportTableDataRow();
    expect(() => {
      const result = service.buildInsightLink(rowWithoutInsight);
      expect(result).not.toBeFalsy();
    }).not.toThrow();
  });
});
