import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { downgradeComponent, UpgradeModule } from '@angular/upgrade/static';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocationUpgradeModule } from '@angular/common/upgrade';
import { $stateProvider } from './ajs-upgraded-providers';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { environment } from '../environments/environment';
import { FileSaverModule } from 'ngx-filesaver';

// Custom Modules
import { AppRoutingModule } from './app-routing.module';
import { LoggerModule } from './modules/logger/logger.module';
import { LogLevel } from './modules/logger/log-level.enum';
import { SharedModule } from './modules/shared/shared.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { TopologyModule } from './modules/topology/topology.module';
import { LiveInsightEdgeModule } from './modules/live-insight-edge/live-insight-edge.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { ApplicationManagementModule } from './modules/application-management/application-management.module';
import { EntityModule } from './modules/entity/entity.module';
import { FilterModule } from './modules/filter/filter.module';
import { FlowPathAnalysisModule } from './modules/flow-path-analysis/flow-path-analysis.module';
import { StoryModule } from './modules/story/story.module';
import { OidPollingModule } from './modules/oid-polling/oid-polling.module';
import { DeviceManagementModule } from './modules/device-management/device-management.module';

// Services
import { CookieService } from 'ngx-cookie-service';
import { AuthHttpInterceptorService } from './interceptors/auth-http-interceptor.service';
import { CustomElementDefinerService } from './services/custom-element-definer/custom-element-definer.service';

// Components
import UpgradeComponent from './utils/UpgradeComponent.interface';
import { AppComponent } from './app.component';
import { TestUpgradePageComponent } from './pages/test-upgrade-page/test-upgrade-page.component';
import { AppbarComponent } from './components/appbar/appbar.component';
import { HelpDropdownComponent } from './components/appbar/help-dropdown/help-dropdown.component';
import { SettingsDropdownComponent } from './components/appbar/settings-dropdown/settings-dropdown.component';
import { ProfileDropdownComponent } from './components/appbar/profile-dropdown/profile-dropdown.component';
import { NotificationsSidebarComponent } from './components/notifications-sidebar/notifications-sidebar.component';
import { AppbarContainer } from './containers/appbar/appbar.container';
import { NotificationsSidebarContainer } from './containers/notifications-sidebar/notifications-sidebar.container';
import { ActiveAlertsCountComponent } from './components/active-alerts-count/active-alerts-count.component';
import { ActiveAlertsCountContainer } from './containers/active-alerts-count/active-alerts-count.container';
import { ReloadPageComponent } from './pages/reload-page/reload-page.component';
import { SelectDowngradeContainer } from './containers/downgrades/select-downgrade/select-downgrade.container';
import { SortableListDowngradeContainer } from './containers/downgrades/sortable-list-downgrade/sortable-list-downgrade.container';
import { NoDataMessageDowngradeContainer } from './containers/downgrades/no-data-message-downgrade/no-data-message-downgrade.container';
import { CacheInterceptor } from './interceptors/cache/cache.interceptor';
import { NotificationDowngradeContainer } from './containers/downgrades/notification-downgrade/notification-downgrade.container';
import { ServiceNowAlertOptionsDowngradeContainer } from './containers/downgrades/service-now-alert-options-downgrade/service-now-alert-options-downgrade.container';
import { AlertManagementPageDowngradeContainer } from './containers/downgrades/alert-management-page-downgrade/alert-management-page-downgrade.container';
import { NotificationLabelDowngradeContainer } from './containers/downgrades/notification-label-downgrade/notification-label-downgrade.container';
import { DeviceCurrentFlowsTabDowngradeContainer } from './containers/downgrades/device-current-flows-tab-downgrade/device-current-flows-tab-downgrade.container';
import { LiveInsightEdgeSummaryPageComponent } from './pages/live-insight-edge-summary-page/live-insight-edge-summary-page.component';
import { DataSourceManagementCardContainer } from './modules/settings/containers/data-source-management-card/data-source-management-card.container';
import { OidPollingPageContainer } from './modules/oid-polling/containers/oid-polling-page/oid-polling-page.container';

// Pipes
import { DecimalPipe } from '@angular/common';

const upgradeElements: Array<UpgradeComponent> = [
  {component: SelectDowngradeContainer, elementName: 'nxu-select'},
  {component: SortableListDowngradeContainer, elementName: 'nxu-old-sortable-list'},
  {component: NoDataMessageDowngradeContainer, elementName: 'nxu-no-data-message'},
  {component: NotificationDowngradeContainer, elementName: 'nxu-notification'},
  {component: ServiceNowAlertOptionsDowngradeContainer, elementName: 'nxu-service-now-alert-options'},
  {component: AlertManagementPageDowngradeContainer, elementName: 'nxu-alert-management-page'},
  {component: NotificationLabelDowngradeContainer, elementName: 'nxu-notification-label'},
  {component: DeviceCurrentFlowsTabDowngradeContainer, elementName: 'nxu-device-current-flows-tab'},
  {component: DataSourceManagementCardContainer, elementName: 'nxu-data-source-management-card'}
];

@NgModule({
  declarations: [
    ActiveAlertsCountComponent,
    ActiveAlertsCountContainer,
    AppComponent,
    AppbarComponent,
    AppbarContainer,
    HelpDropdownComponent,
    ProfileDropdownComponent,
    NotificationsSidebarComponent,
    NotificationsSidebarContainer,
    ReloadPageComponent,
    SettingsDropdownComponent,
    TestUpgradePageComponent,
    SelectDowngradeContainer,
    SortableListDowngradeContainer,
    NoDataMessageDowngradeContainer,
    NotificationDowngradeContainer,
    ServiceNowAlertOptionsDowngradeContainer,
    AlertManagementPageDowngradeContainer,
    NotificationLabelDowngradeContainer,
    DeviceCurrentFlowsTabDowngradeContainer,
    LiveInsightEdgeSummaryPageComponent,
    DataSourceManagementCardContainer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FileSaverModule,
    // setup to only send error logging to the server
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/log/error',
      level: LogLevel.INFO,
      serverLogLevel: LogLevel.ERROR
    }),
    SharedModule,
    NotificationsModule,
    IntegrationsModule,
    TopologyModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    BrowserAnimationsModule,
    SettingsModule,
    ReactiveFormsModule,
    LiveInsightEdgeModule,
    FormsModule,
    AlertsModule,
    ApplicationManagementModule,
    FilterModule,
    EntityModule,
    UpgradeModule,
    LocationUpgradeModule.config(),
    FlowPathAnalysisModule,
    StoryModule,
    OidPollingModule,
    DeviceManagementModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    DecimalPipe,
    $stateProvider,
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: {
        baseUrl: '/api'
      }
    }
  ]
})
export class AppModule implements DoBootstrap {
  constructor(private customElementDefiner: CustomElementDefinerService, private upgrade: UpgradeModule) {
    this.customElementDefiner.defineCustomElements(upgradeElements);
  }

  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ['laClientApp']);
  }
}

// @ts-ignore
angular.module('laClientApp')
  .directive(
    'nxLiveInsightEdgeSummaryPage',
    downgradeComponent({component: LiveInsightEdgeSummaryPageComponent})
  )
  .directive(
    'nxOidPollingPage',
    downgradeComponent({component: OidPollingPageContainer})
  );
