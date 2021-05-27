import {UnconfiguredMessageService} from '../../../modules/live-insight-edge/services/unconfigured-message/unconfigured-message.service';
import {LiveInsightEdgeConnectionStatusModel} from './live-insight-edge-connection-status-model';
import {Injectable} from '@angular/core';
import {AnalyticsPlatformConnection, AnalyticsPlatformConnectionState} from './analytics-platform-connection';
import {LaNoDataMessage} from '../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {StatusIndicatorValues} from '../../../modules/shared/components/status-indicator/enums/status-indicator-values.enum';

@Injectable({providedIn: 'root'})

export class LiveInsightEdgeConnectionStatusService {

  constructor(
    private unconfiguredMessageService: UnconfiguredMessageService
  ) {
  }

  /**
   * Get a model representing the state of the LiveNA connection
   * @param connection - the response from the LiveNA server for the connection status
   */
  getConnectionStatusModel(connection: AnalyticsPlatformConnection): LiveInsightEdgeConnectionStatusModel {
    const connectionStatus = this.getDisplayStatus(connection);
    let message = '';
    switch (connectionStatus) {
      case StatusIndicatorValues.ERROR:
        message = connection.errorMessage;
        break;
      case StatusIndicatorValues.UNKNOWN:
        message = 'Unable to determine LiveNA server status';
        break;
      case StatusIndicatorValues.CONNECTING:
        message = 'Trying to establish connection to LiveNA... Please retry in a moment';
        break;
      case StatusIndicatorValues.DOWN:
        message = 'LiveNA cannot be reached. A restart of LiveNX/LiveNA is required';
        break;
      case StatusIndicatorValues.CONNECTED:
        message = 'Connection established';
        break;
      case StatusIndicatorValues.UNCONFIGURED:
        message = 'LiveNA is not configured';
        break;
      default:
    }

    return {status: connectionStatus, message: message};
  }

  /**
   * Determine the display status based on the connection status returned from server.
   * Display status is determined by a mixture of connection state and configuration state.
   * @param connection - the connection information returned from server
   */
  getDisplayStatus(connection: AnalyticsPlatformConnection): StatusIndicatorValues {
    // If there is no configuration, return unconfigured regardless if there is an error.
    // We assume users will only care if there is an error if they have configured the system
    if (connection.configured === false) {
      return StatusIndicatorValues.UNCONFIGURED;
    }

    // If configured, check the connection state
    switch (connection.connectionState) {
      case AnalyticsPlatformConnectionState.CONNECTED:
        return StatusIndicatorValues.CONNECTED;
      case AnalyticsPlatformConnectionState.CONNECTING:
        return StatusIndicatorValues.CONNECTING;
      case AnalyticsPlatformConnectionState.ERROR:
        return StatusIndicatorValues.ERROR;
      case AnalyticsPlatformConnectionState.DOWN:
        return StatusIndicatorValues.DOWN;
      default:
        // This must be an unhandled state we do not know about
        return StatusIndicatorValues.UNKNOWN;
    }
  }

  /**
   * Get a no data model if applicable.  A no data model represents a message that should be presented to users with
   * an icon.  Generally this only happens in non-optimal states.
   */
  getConnectionStatusMessage(connectionStatusModel: LiveInsightEdgeConnectionStatusModel): LaNoDataMessage {
    switch (connectionStatusModel.status) {
      case StatusIndicatorValues.UNKNOWN:
      case StatusIndicatorValues.UNCONFIGURED:
        return this.unconfiguredMessageService.getNoDataMessage();
      case StatusIndicatorValues.ERROR:
      case StatusIndicatorValues.DOWN:
      case StatusIndicatorValues.CONNECTING:
        return {
          title: 'Unable to communicate with LiveNA Server',
          instruction: connectionStatusModel.message,
          icon: 'la-no-data-message__icon-warning',
        };
      case StatusIndicatorValues.CONNECTED:
        break;
      default:
      // Do nothing. Let default error messaging within loading component handle it
    }
    return null;
  }
}

