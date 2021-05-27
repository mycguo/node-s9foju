import {Injectable} from '@angular/core';
import {addSeconds, distanceInWordsToNow, format, parse} from 'date-fns';

import ReportClassificationContextEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/reportClassificationContextEnum';
import ReportClassificationSourceEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/reportClassificationSourceEnum';
import ReportPriorityEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/reportPriorityEnum';
import LaSourceInfoTypesEnum from '../../../../../../../client/laCommon/constants/laSourceInfoTypes.constant';
import {TemplateType} from '../../components/status-alert-details-parameters-group/enums/template-type.enum';

import {ILaReportQueueRequest} from '../../../../../../../project_typings/api/reportTemplate/ILaReportQueueRequest';
import StatusAlertItemInterface from '../../components/status-alerts-item/interfaces/status-alert-item';
import {IAlertSourceInfo} from '../../../../../../../project_typings/api/alerting/alerts/AlertInterfaces';
import {Group} from '../../components/status-alert-details-parameters-group/models/group/group';
import AlertTypes from '../../../../../../../project_typings/api/alerting/alerts/AlertTypes';
import {Details} from '../../components/status-alert-details-drawer/models/details/details';
import {IDrilldown} from '../../../../../../../project_typings/client/PageDrilldownModels';
import * as _ from 'lodash';
import {CommonService} from '../../../../utils/common/common.service';
import StringParameter from '../../components/status-alert-details-parameters-group/models/parameter/parameter-type/string-parameter';
import LinkParameter from '../../components/status-alert-details-parameters-group/models/parameter/parameter-type/link-parameter';
import SeverityParameter from '../../components/status-alert-details-parameters-group/models/parameter/parameter-type/severity-parameter';

const sourceInfoParameterTypesHaveDrilldown: LaSourceInfoTypesEnum[] = [
  LaSourceInfoTypesEnum.DEVICE,
  LaSourceInfoTypesEnum.INTERFACE,
  LaSourceInfoTypesEnum.SITE,
  LaSourceInfoTypesEnum.REPORT,
  LaSourceInfoTypesEnum.FIVE_TUPLE,
  LaSourceInfoTypesEnum.NODE,
  LaSourceInfoTypesEnum.SITE_PAIR
];

@Injectable({
  providedIn: 'root'
})
export class StatusAlertDetailsService {
  constructor(private commonService: CommonService) {
  }

  getTransformedData(serverData: StatusAlertItemInterface): Details {
    return new Details(
      serverData && serverData.sourceSite && serverData.sourceSite.siteName,
      serverData && serverData.description && serverData.description.title,
      serverData && serverData.severity,
      serverData ? this.getGroupsData(serverData) : [],
      serverData && serverData.type === AlertTypes.SDWAN_ALARM ? 'Please use vManage to modify Cisco SD-WAN alarms' : undefined
    );
  }

  private getGroupsData(serverData: StatusAlertItemInterface): Group[] {
    let groups: Group[] = [this.getStatusAndTimeGroupData(serverData)];
    if (serverData.type !== AlertTypes.SDWAN_ALARM && serverData.description && serverData.description.sourceInfo) {
      groups.push(this.getSourceInfoGroupData(serverData.description.sourceInfo));
    }

    if ((serverData.description && serverData.description.summary) || (serverData.type && serverData.alertId)) {
      groups = [...groups, this.getDescriptionGroupData(serverData)];
    }

    if ((serverData.description && serverData.description.details) || serverData.severity) {
      groups = [...groups, this.getDetailsGroupData(serverData)];
    }

    return groups;
  }

  private getStatusAndTimeGroupData(serverData: StatusAlertItemInterface): Group {
    const parameters = [
      new StringParameter('Time Opened', format(serverData.dateCreated, 'DD MMM YYYY, hh:mmA')),
      new StringParameter('Active for', distanceInWordsToNow(serverData.dateCreated))
    ];

    if (serverData.userStatus) {
      parameters.unshift(new StringParameter(
        'State',
        this.commonService.capitalize(serverData.userStatus)
      ));
    }

    return new Group('Status & Time', parameters);
  }

  private getSourceInfoGroupData(sourceInfo: Array<IAlertSourceInfo>): Group {
    const parameters = sourceInfo.map((parameter: IAlertSourceInfo) => {
      if (sourceInfoParameterTypesHaveDrilldown.findIndex(type => type === parameter.type ) !== -1) {
        const drilldown = this.getDrillDownLink(parameter);
        return new LinkParameter(
          parameter.label,
          {title: parameter.displayValue, link: drilldown.stateName, params: drilldown.params}
        );
      }
      return new StringParameter(parameter.label, parameter.displayValue);
    });

    return new Group('Source Info', parameters);
  }

  private getDescriptionGroupData(serverData: StatusAlertItemInterface): Group {
    return new Group(
      'Description',
      undefined,
      serverData.description ? serverData.description.summary : undefined,
      serverData.type !== AlertTypes.SDWAN_ALARM ? undefined : {
        link: 'alerts',
        params: {alertId: serverData.alertId}
      }
    );
  }

  private getDetailsGroupData(serverData: StatusAlertItemInterface): Group {
    const parameters = !(serverData.description && serverData.description.details) ? [] :
      serverData.description.details
        .filter((detailsItem) =>
          !serverData.description.sourceInfo.find((sourceInfoItem) =>
            sourceInfoItem.label === detailsItem.label
          )
        )
        .map((parameter) => {
          return new StringParameter(parameter.label, parameter.value);
        });

    if (!parameters.find((parameter) => parameter.key === 'Severity')) {
      parameters.unshift(new SeverityParameter('Severity', serverData.severity));
    }

    return new Group('Details', parameters);
  }

  private getDrillDownLink(sourceInfo: IAlertSourceInfo): IDrilldown {
    let stateName: string;
    let params: any = {};
    switch (sourceInfo.type) {
      case LaSourceInfoTypesEnum.DEVICE:
        stateName = `device/${sourceInfo.rawValue.deviceSerial}`;
        if (sourceInfo.rawValue.deviceName) {
          params = {deviceName: sourceInfo.rawValue.deviceName};
        }
        break;

      case LaSourceInfoTypesEnum.INTERFACE:
        stateName = `device/${sourceInfo.rawValue.deviceSerial}/interface/${encodeURIComponent(sourceInfo.rawValue.interfaceName)}`;
        break;

      case LaSourceInfoTypesEnum.SITE:
        stateName = `sites/name/${encodeURIComponent(sourceInfo.rawValue.siteName)}`;
        if (sourceInfo.rawValue.site) {
          params = {site: sourceInfo.rawValue.site};
        }
        break;

      case LaSourceInfoTypesEnum.REPORT:
        stateName = 'reports/redirect';
        const reportRequest: ILaReportQueueRequest = {
          name: sourceInfo.displayValue,
          sharingConfig: [],
          priority: ReportPriorityEnum.P4,
          classification: {context: ReportClassificationContextEnum.REPORT, source: ReportClassificationSourceEnum.OPERATIONS_DASHBOARD},
          reports: sourceInfo.rawValue.reports
        };
        params.params = encodeURIComponent(JSON.stringify(reportRequest));
        break;

      case LaSourceInfoTypesEnum.FIVE_TUPLE:
        stateName = 'topology/path';
        params = _.pick(sourceInfo.rawValue, ['srcIp', 'srcPort', 'dstIp', 'dstPort', 'protocol', 'flowType']);
        const isoTime = sourceInfo.rawValue['time'];
        const isoDate = parse(isoTime);
        const updatedDate = addSeconds(isoDate, 1);
        params.endDate = format(updatedDate, 'YYYY-MM-DD[T]HH:mm:ssZZ');
        break;

      case LaSourceInfoTypesEnum.NODE:
        stateName = 'node-information';
        if (sourceInfo.rawValue.nodeId) {
          params.nodeId = sourceInfo.rawValue.nodeId;
        }
        break;

      case LaSourceInfoTypesEnum.SITE_PAIR:
        stateName = 'siteToSite/drilldown';
        if (sourceInfo.rawValue.sourceSite) {
          params.srcSite = sourceInfo.rawValue.sourceSite;
        }

        if (sourceInfo.rawValue.destinationSite) {
          params.dstSite = sourceInfo.rawValue.destinationSite;
        }
        break;
    }

    const commonParams = {
      fromPath: 'nxTopology.sdWanTopology',
      fromName: 'Geo Topology'
    };

    return {
      stateName: stateName,
      params: Object.assign(params, commonParams)
    };
  }
}
