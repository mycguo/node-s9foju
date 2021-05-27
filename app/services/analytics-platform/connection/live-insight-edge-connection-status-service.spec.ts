import {TestBed} from '@angular/core/testing';
import {LiveInsightEdgeConnectionStatusService} from './live-insight-edge-connection-status-service';
import {AnalyticsPlatformConnection, AnalyticsPlatformConnectionState} from './analytics-platform-connection';
import {StatusIndicatorValues} from '../../../modules/shared/components/status-indicator/enums/status-indicator-values.enum';
import {LoggerTestingModule} from '../../../modules/logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeConnectionStatusService', () => {

  let service: LiveInsightEdgeConnectionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ]
    });
    service = TestBed.get(LiveInsightEdgeConnectionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be valid', () => {
    const mockResponse = new AnalyticsPlatformConnection();
    mockResponse.configured = true;
    mockResponse.connectionState = AnalyticsPlatformConnectionState.CONNECTED;
    mockResponse.analyticsVersion = '1.0';
    mockResponse.analyticsUptimeMillis = 100;
    expect(service.getDisplayStatus(mockResponse)).toEqual(StatusIndicatorValues.CONNECTED);
  });

  it('should be unconfigured', () => {
    // If the server is unconfigured the status should be unconfigured regardless of connection status
    const mockResponse = new AnalyticsPlatformConnection();
    mockResponse.configured = false;
    mockResponse.connectionState = AnalyticsPlatformConnectionState.CONNECTED;
    mockResponse.analyticsVersion = '1.0';
    mockResponse.analyticsUptimeMillis = 100;
    expect(service.getDisplayStatus(mockResponse)).toEqual(StatusIndicatorValues.UNCONFIGURED);
  });
});
