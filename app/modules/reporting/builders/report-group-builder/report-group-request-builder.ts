import ReportClassificationContext from '../../models/api/request/enums/report-classification-context';
import {ReportPriority} from '../../models/api/request/enums/report-priority';
import {ReportRequest} from '../../models/api/request/sub/report-request';
import {QueueReportGroupRequest} from '../../models/api/request/queue-report-group-request';
import {ReportSharingConfig} from '../../models/api/request/sub/report-sharing-config';
import {ReportRequestTimeZone} from '../../models/api/request/sub/report-request-time-zone';
import {ReportRequestGlobalParameters} from '../../models/api/request/sub/report-request-global-parameters';
import {ReportPresentationMode} from '../../models/api/request/enums/report-presentation-mode';
import {ReportClientTimeParameter} from '../../models/api/request/sub/report-client-time-parameter';
import {ReportLogoParameter} from '../../models/api/request/sub/report-logo-parameter';
import ReportClassificationSource from '../../models/api/request/enums/report-classification-source';

export class ReportGroupRequestBuilder {
  private _name: string;
  private _reports: Array<ReportRequest> = [];
  private _priority: ReportPriority;
  private _context: ReportClassificationContext;
  private _sharingConfig: Array<ReportSharingConfig>;
  private _timezone: ReportRequestTimeZone;
  private _resultUrl: string;
  private _globalReportParameters: ReportRequestGlobalParameters;
  private _reportFootNote: string;
  private _presentationMode: ReportPresentationMode;
  private _clientTimeParameters: ReportClientTimeParameter;
  private _logo: ReportLogoParameter;


  constructor(name: string,
              context: ReportClassificationContext,
              priority: ReportPriority,
              reports: Array<ReportRequest> = []) {
    this._name = name;
    this._context = context;
    this._priority = priority;
    this._reports = reports;
  }

  public addReport(report: ReportRequest): ReportGroupRequestBuilder {
    this._reports.push(report);
    return this;
  }

  public setSharingConfig(sharingConfig: Array<ReportSharingConfig>): ReportGroupRequestBuilder {
    this._sharingConfig = sharingConfig;
    return this;
  }

  public setTimezone(timezone: ReportRequestTimeZone): ReportGroupRequestBuilder {
    this._timezone = timezone;
    return this;
  }

  public setResultsUrl(resultsUrl: string): ReportGroupRequestBuilder {
    this._resultUrl = resultsUrl;
    return this;
  }

  public setGlobalParameters(globalParameters: ReportRequestGlobalParameters): ReportGroupRequestBuilder {
    this._globalReportParameters = globalParameters;
    return this;
  }

  public setReportFootnote(reportFootNote: string): ReportGroupRequestBuilder {
    this._reportFootNote = reportFootNote;
    return this;
  }

  public setPresentationMode(presentationMode: ReportPresentationMode): ReportGroupRequestBuilder {
    this._presentationMode = presentationMode;
    return this;
  }


  public setClientTimeParameters(clientTimeParameter: ReportClientTimeParameter): ReportGroupRequestBuilder {
    this._clientTimeParameters = clientTimeParameter;
    return this;
  }

  public setLogoId(logoId: string): ReportGroupRequestBuilder {
    this._logo = {id: logoId};
    return this;
  }

  build(): QueueReportGroupRequest {
    return {
      name: this._name,
      reports: this._reports,
      sharingConfig: this._sharingConfig,
      timeZone: this._timezone,
      globalReportParameters: this._globalReportParameters,
      reportFootNote: this._reportFootNote,
      presentationMode: this._presentationMode,
      clientTimeParameters: this._clientTimeParameters,
      logo: this._logo,
      resultsUrl: this._resultUrl,
      priority: this._priority,
      classification: {
        source: ReportClassificationSource.OPERATIONS_DASHBOARD,
        context: this._context
      }
    };
  }
}
