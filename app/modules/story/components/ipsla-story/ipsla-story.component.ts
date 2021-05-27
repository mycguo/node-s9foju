import {Component} from '@angular/core';
import {Tab} from '../../../shared/components/tabset/tab';
import {ComponentFactoryHelper} from '../../../../utils/component-factory-helper/component-factory-helper';
import {IpslaStoryTabContainer} from '../../containers/ipsla-story-tab/ipsla-story-tab.container';
import {ReportIpslaStatAggregationType} from '../../../reporting/models/api/parameter-enums/report-ipsla-stat-aggregation-type.enum';
import {ReportIpslaType} from '../../../reporting/models/api/parameter-enums/report-ipsla-type.enum';
import {ToggleModel} from '../../../shared/components/form/toggle/models/toggle.model';
import {ipslaTypeNames} from '../../constants/ipsla-type-record.constant';
import SwitcherModel from '../../../shared/components/form/switcher/models/switcher.model';
import {FilteredReportTableGeneratorOptionColumn} from '../../../dashboard/services/filtered-report-table-config-generator/filtered-report-table-generator-option-column';

interface TabWidgetDef {
  id: ReportIpslaType;
  label: string;
  grouped?: Array<{ name: string, props: Array<string> }>;
  columns?: { [key: string]: FilteredReportTableGeneratorOptionColumn };
}

@Component({
  selector: 'nx-ipsla-story',
  templateUrl: './ipsla-story.component.html',
  styleUrls: ['./ipsla-story.component.less']
})
export class IpslaStoryComponent {
  tabs: Array<Tab>;

  toggleModel: ToggleModel;

  switcherModel: SwitcherModel;
  selectedSwitcher = ReportIpslaStatAggregationType.LATEST;

  /**
   * NOTE: Latest and Average can yield different columns/groups for the same type
   */
  private readonly tabWidgetDef: Array<TabWidgetDef> = [
    {
      id: ReportIpslaType.ALL,
      label: ipslaTypeNames.get(ReportIpslaType.ALL)
    },
    {
      id: ReportIpslaType.DHCP,
      label: ipslaTypeNames.get(ReportIpslaType.DHCP)
    },
    {
      id: ReportIpslaType.DNS,
      label: ipslaTypeNames.get(ReportIpslaType.DNS)
    },
    {
      id: ReportIpslaType.ECHO,
      label: ipslaTypeNames.get(ReportIpslaType.ECHO)
    },
    {
      id: ReportIpslaType.ICMP_JITTER,
      label: ipslaTypeNames.get(ReportIpslaType.ICMP_JITTER)
    },
    {
      id: ReportIpslaType.FTP,
      label: ipslaTypeNames.get(ReportIpslaType.FTP)
    },
    {
      id: ReportIpslaType.HTTP,
      label: ipslaTypeNames.get(ReportIpslaType.HTTP),
      grouped: [
        {name: 'Round Trip Latency by Protocol (ms)', props: ['RttDns', 'RttTcpConnect', 'RttTransaction']},
        {name: 'Timeout (ms)', props: ['TimeoutDns', 'TimeoutTcpConnect', 'TimeoutTransaction']},
        {name: 'Errors (packets)', props: ['ErrorsDns', 'ErrorsHttp']}
      ],
      columns: {
        'RttDns': {label: 'DNS'},
        'RttTcpConnect': {label: 'TCP Connect'},
        'RttTransaction': {label: 'Transaction'},
        'TimeoutDns': {label: 'DNS'},
        'TimeoutTcpConnect': {label: 'TCP Connect'},
        'TimeoutTransaction': {label: 'Transaction'},
        'ErrorsDns': {label: 'DNS'},
        'ErrorsHttp': {label: 'HTTP'}
      }
    },
    {
      id: ReportIpslaType.JITTER,
      label: ipslaTypeNames.get(ReportIpslaType.JITTER),
      grouped: [
        {name: 'Loss (packets)', props: ['LossSrcToDst', 'LossDstToSrc']},
        {name: 'MOS', props: ['MosMin', 'MosMax']}
      ],
      columns: {
        'LossSrcToDst': {label: 'Src → Dst'},
        'LossDstToSrc': {label: 'Dst → Src'},
        'MosMin': {label: 'Min'},
        'MosMax': {label: 'Mox'}
      }
    },
    {
      id: ReportIpslaType.VIDEO,
      label: ipslaTypeNames.get(ReportIpslaType.VIDEO)
    },
    {
      id: ReportIpslaType.UDP_ECHO,
      label: ipslaTypeNames.get(ReportIpslaType.UDP_ECHO)
    },
    {
      id: ReportIpslaType.PATH_JITTER,
      label: ipslaTypeNames.get(ReportIpslaType.PATH_JITTER)
    },
    {
      id: ReportIpslaType.PATH_ECHO,
      label: ipslaTypeNames.get(ReportIpslaType.PATH_ECHO)
    }
  ];

  constructor() {
    this.switcherModel = new SwitcherModel([
      {name: ReportIpslaStatAggregationType.LATEST, displayValue: ReportIpslaStatAggregationType.LATEST},
      {name: ReportIpslaStatAggregationType.AVERAGE, displayValue: ReportIpslaStatAggregationType.AVERAGE}
    ]);
    this.tabs = this.buildTabs(this.selectedSwitcher);
  }

  buildTabs(selectedAggregationType: ReportIpslaStatAggregationType): Array<Tab> {
    return this.tabWidgetDef.map((widgetDef: TabWidgetDef) => {
      return new Tab(
        widgetDef.id,
        widgetDef.label,
        new ComponentFactoryHelper(IpslaStoryTabContainer,
          {
            id: widgetDef.id,
            columns: widgetDef.columns,
            grouped: widgetDef.grouped,
            ipslaStatAggregationType: selectedAggregationType,
          }
        ));
    });
  }

  onIpslaTypeChange(selectedAggregationType: ReportIpslaStatAggregationType): void {
    this.tabs = this.buildTabs(selectedAggregationType);
  }
}
