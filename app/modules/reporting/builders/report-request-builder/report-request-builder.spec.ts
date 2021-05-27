import {ReportRequestBuilder} from './report-request-builder';
import ReportCategoryParameter from '../../models/api/parameter-enums/report-category-parameter';
import {ReportRequest} from '../../models/api/request/sub/report-request';

describe('ReportRequestBuilder', () => {
  it('should create an instance', () => {
    const reportRequestBuilder = new ReportRequestBuilder();
    reportRequestBuilder.setReportId(2, ReportCategoryParameter.FLOW, 'name');
    reportRequestBuilder.setParameters({deviceSerial: '123'});
    reportRequestBuilder.setReportName('report-name');
    reportRequestBuilder.setReportDescription('description');
    const report: ReportRequest = reportRequestBuilder.build();

    expect(report).toEqual(jasmine.objectContaining({
      reportId: {id: 2, category: ReportCategoryParameter.FLOW, name: 'name'},
      parameters: {deviceSerial: '123'},
      reportName: 'report-name',
      reportDescription: 'description'
    } as ReportRequest));
  });
});
