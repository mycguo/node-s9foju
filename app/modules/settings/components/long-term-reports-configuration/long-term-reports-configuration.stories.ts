import { LongTermReportsConfigurationComponent } from './long-term-reports-configuration.component';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { LongTermReport } from '../../services/long-term-reports/long-term-report.model';

const IDENTIFIERS: LongTermReport[] = [
  {
    'reportKey': 'AS_PAIR',
    'reportName': 'AS Pair',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'TOP_DEVICES_PERF',
    'reportName': 'Application Performance By Device',
    'longTermEnabled': true,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'PERF_BY_INTERFACE',
    'reportName': 'Application Performance By Interface',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SERVICE_PROVIDER_PERF',
    'reportName': 'Application Performance By Service Provider',
    'longTermEnabled': true,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'TOP_SITES_PERF',
    'reportName': 'Application Performance By Site',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'BIDIR_AS_PAIR',
    'reportName': 'Bidirectional AS Pair',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'BIDIR_NETWORK_PAIR',
    'reportName': 'Bidirectional Network Pair',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'BIDIR_ADDRESS_PAIR',
    'reportName': 'Bidirectional Source/Destination Pair',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'BUSINESS_RELEVANCE',
    'reportName': 'Business Relevance',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'DST_AS',
    'reportName': 'Destination AS',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'DST_NETWORK',
    'reportName': 'Destination Network',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'DEST_SITE_TRAFFIC',
    'reportName': 'Destination Site Traffic',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'PERFMON_SSRC_JITTER_LOSS',
    'reportName': 'Jitter/Loss',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'NETWORK_PAIR',
    'reportName': 'Network Pair',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'PFR_OUT_OF_POLICY_EVENTS',
    'reportName': 'Out of Policy Events',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'PROTOCOLS',
    'reportName': 'Protocol',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'PROTOCOLS_PORTS',
    'reportName': 'Protocol Port',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SITE_TRAFFIC',
    'reportName': 'Site Traffic',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SRC_AS',
    'reportName': 'Source AS',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SRC_NETWORK',
    'reportName': 'Source Network',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SRC_SITE_TRAFFIC',
    'reportName': 'Source Site Traffic',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SRC_OR_DST_AS',
    'reportName': 'Source or Destination AS',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SRC_OR_DST_ADDRESS',
    'reportName': 'Source or Destination Address',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'SRC_OR_DST_NETWORK',
    'reportName': 'Source or Destination Network',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'AVC_NBAR_APPLICATION',
    'reportName': 'Top Applications Performance',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'TOP_PERFORMANCE_JITTER_LOSS_APPLICATION',
    'reportName': 'Top Voice/Video Performance Summary',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'PERFMON_SSRC_JITTER_LOSS_APPLICATION',
    'reportName': 'Top Voice/Video Performance by SSRC',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'TRAFFIC_CLASS',
    'reportName': 'Traffic Class',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'MEDIANET_PERFORMANCE_BY_DEVICE',
    'reportName': 'Voice/Video Performance By Device',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'MEDIANET_PERFORMANCE_BY_INTERFACE',
    'reportName': 'Voice/Video Performance By Interface',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'MEDIANET_PERFORMANCE_BY_SERVICE_PROVIDER',
    'reportName': 'Voice/Video Performance By Service Provider',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  }, {
    'reportKey': 'MEDIANET_PERFORMANCE_BY_SITE',
    'reportName': 'Voice/Video Performance By Site',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  },
  {
    'reportKey': '1234',
    'reportName': 'Some Dynamic Report 1',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  },
  {
    'reportKey': '2345',
    'reportName': 'Some Dynamic Report 2',
    'longTermEnabled': true,
    'longTermCapable': true,
    'isDynamic': true
  },
  {
    'reportKey': '3456',
    'reportName': 'Some Dynamic Report 3',
    'longTermEnabled': false,
    'longTermCapable': true,
    'isDynamic': false
  },
  {
    'reportKey': '4567',
    'reportName': 'Some Dynamic Report 4',
    'longTermEnabled': true,
    'longTermCapable': false,
    'isDynamic': true
  }

];

export default {
  title: 'Settings/LongTermReportsConfigurationComponent',
  decorators: [
    moduleMetadata({
      imports: [
        SharedModule
      ]
    })
  ]
};

export const Default = () => ({
  component: LongTermReportsConfigurationComponent,
  props: {
    reportsList: IDENTIFIERS
  }
});

Default.story = {
  name: 'default'
};
