import {RequestErrors} from '../../../../utils/api/request-errors';

interface LiveInsightEdgePageState {
  isConfigModalOpen: boolean;
  isDeviceAddModalOpen: boolean;
  isAppGroupAddModalOpen: boolean;
  doesConfigurationExist: boolean;

  isDeleteDevicesButtonActive: boolean;
  isAddDevicesButtonActive: boolean;
  isImportSnmpButtonActive: boolean;
  addMonitoredDevicesSubmitErrors: RequestErrors;
  deleteMonitoredDevicesSubmitErrors: RequestErrors;

  isAppGroupDeleteButtonActive: boolean;
  isAppGroupAddButtonActive: boolean;
  addMonitoredAppGroupSubmitErrors: RequestErrors;
  deleteMonitoredAppGroupSubmitErrors: RequestErrors;
}

export default LiveInsightEdgePageState;
