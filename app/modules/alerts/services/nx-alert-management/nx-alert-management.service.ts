import {Injectable} from '@angular/core';
import {NxAlertManagementHierarchical} from './models/nx-alert-management-hierarchical';
import NxAlertManagementConfig from './models/nx-alert-management-config';
import NxAlertManagementConfigThreshold from './models/nx-alert-management-config-threshold';
import {NxAlertManagementState} from '../../stores/nx-alert-management/nx-alert-management-state';
import {catchError, debounceTime, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {combineLatest, forkJoin, Observable, throwError} from 'rxjs';
import {CommonService} from '../../../../utils/common/common.service';
import NxAlertManagement from '../nx-alert-management/models/nx-alert-management';
import {AlertManagementService} from '../alert-management/alert-management.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CouriersService} from '../couriers/couriers.service';
import {NodesService} from '../../../../services/nodes/nodes.service';
import {WebUiAlertsService} from '../web-ui-alerts/web-ui-alerts.service';
import {CustomOidsService} from '../../../../services/custom-oids/custom-oids.service';
import {AlertIdentifierResponse} from '../alert-identifiers/models/alert-identifier-response';
import {Courier} from '../couriers/models/courier';
import {WebUiAlert} from '../web-ui-alerts/models/web-ui-alert';
import {Node} from '../../../../services/nodes/models/node';
import {CustomOid} from '../../../../services/custom-oids/models/custom-oid';
import {ALERT_TYPES} from './constants/alert-types.constants';
import {AlertIdentifierThresholdResponse} from '../alert-identifiers/models/alert-identifier-threshold-response';
import {AlertIdentifierRequest} from '../alert-identifiers/models/alert-identifier-request';
import {AlertType} from './models/alert-type';
import {AlertThreshold} from './models/alert-threshold';
import {LaAlertingTransformService} from '../laAlertManagementTransform';
import {AlertIdentifiersService} from '../alert-identifiers/alert-identifiers.service';
import {AlertIdentifierSource} from '../alert-identifiers/alert-identifier-source.enum';
import {SimpleFilterService} from '../../../../services/table-filter/simple-filter.service';
import {NxAlertManagementStore} from '../../stores/nx-alert-management/nx-alert-management.store';
import {NxAlertManagementQuery} from '../../stores/nx-alert-management/nx-alert-management.query';
import {ThresholdComponentOption} from '../../components/side-bar/thresholds/threshold-component-option.enum';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {AlertSharing} from '../couriers/models/alert-sharing';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class NxAlertManagementService extends SimpleFilterService<NxAlertManagementState, NxAlertManagement, NxAlertManagementQuery> {
  private static readonly ALLOWABLE_GLOBAL_FILTER_KEYS: Array<string> =
    ['name', 'category', 'severity', 'thresholdString', 'sharingString'];

  // used for showing sidebar in angularjs (can remove after migration of sidebar)
  private laAlertViewModels: Array<any> = [];
  private transformService = new LaAlertingTransformService();

  constructor(private http: HttpClient,
              private logger: Logger,
              private alertIdentifiersService: AlertIdentifiersService,
              private couriersService: CouriersService,
              private webUiAlertsService: WebUiAlertsService,
              private nodesService: NodesService,
              private customOidsService: CustomOidsService,
              private alertManagementService: AlertManagementService,
              private commonService: CommonService,
              private store: NxAlertManagementStore,
              query: NxAlertManagementQuery
  ) {
    super(query, void 0, 'id', NxAlertManagementService.ALLOWABLE_GLOBAL_FILTER_KEYS);

    // subscribe to all services required to build alert object and update NxAlertManagement store
    // use selectLoading to determine if all items are ready to be merged
    combineLatest([
      this.selectLoading(),
      this.alertIdentifiersService.selectAlertIdentifiers(AlertIdentifierSource.LIVE_NX),
      this.couriersService.selectCouriers(),
      this.webUiAlertsService.selectWebUiAlerts(),
      this.nodesService.selectNodes(),
      this.customOidsService.selectCustomOids()
    ])
      .pipe(
        debounceTime(100),
        filter(([isLoading, identifiers, couriers, webUiAlerts, nodes, customOids]:
                  [boolean, Array<AlertIdentifierResponse>, Array<Courier>, Array<WebUiAlert>, Array<Node>, Array<CustomOid>]) => {
          return !isLoading;
        }),
        map(([isLoading, identifiers, couriers, webUiAlerts, nodes, customOids]:
               [boolean, Array<AlertIdentifierResponse>, Array<Courier>, Array<WebUiAlert>, Array<Node>, Array<CustomOid>]) => {
          return [identifiers, couriers, webUiAlerts, nodes, customOids];
        })
      )
      .subscribe(([identifiers, couriers, webUiAlerts, nodes, customOids]:
                    [Array<AlertIdentifierResponse>, Array<Courier>, Array<WebUiAlert>, Array<Node>, Array<CustomOid>]) => {
        const alerts: Array<NxAlertManagement> = this.buildAlerts(identifiers, couriers, webUiAlerts, nodes, customOids);
        this.store.set(alerts);
      });
  }

  // for use with Angularjs
  getLaAlertViewModel(alertId: string): any {
    return this.laAlertViewModels.find((alert: any) => alert.id === alertId);
  }

  // data
  selectLoading(): Observable<boolean> {
    return combineLatest([
      this.alertIdentifiersService.selectLoading(),
      this.couriersService.selectLoading(),
      this.webUiAlertsService.selectLoading(),
      this.nodesService.selectLoading(),
      this.customOidsService.selectLoading()
    ]).pipe(
      map((data: [boolean, boolean, boolean, boolean, boolean]) => {
        return !data.every((value: boolean) => !value);
      }),
      debounceTime(100)
    );
  }

  selectError(): Observable<Error> {
    return combineLatest([
      this.alertIdentifiersService.selectError(),
      this.couriersService.selectError(),
      this.webUiAlertsService.selectError(),
      this.nodesService.selectError(),
      this.customOidsService.selectError()
    ]).pipe(
      map((data: [Error, Error, Error, Error, Error]) => {
        let error: Error;
        for (let i = 0; i < data.length; i++) {
          if (data[i] !== void 0) {
            error = data[i];
            break;
          }
        }
        return error;
      })
    );
  }

  getAlerts(): Observable<Array<NxAlertManagement>> {
    return forkJoin([
      this.alertIdentifiersService.getIdentifiers(AlertIdentifierSource.LIVE_NX),
      this.couriersService.getCouriers(),
      this.webUiAlertsService.getWebUiAlerts(),
      this.nodesService.getNodes(),
      this.customOidsService.getCustomOids()
    ])
      .pipe(
        map(([identifiers, couriers, webUiAlerts, nodes, customOids]:
               [Array<AlertIdentifierResponse>, Array<Courier>, Array<WebUiAlert>, Array<Node>, Array<CustomOid>]
        ) => {
          // we do not care if this succeeds or errors
          // [LD-26099] goes in we can remove this
          this.alertManagementService.createMissingAlertWebUiSettings(identifiers, webUiAlerts)
            .pipe(take(1))
            .subscribe();

          this.laAlertViewModels = this.rebuildLaAlertViewModels(
            identifiers,
            couriers,
            webUiAlerts,
            nodes,
            customOids);

          return this.buildAlerts(identifiers, couriers, webUiAlerts, nodes, customOids);
        })
      );
  }

  findAlert(alertId: string): NxAlertManagement {
    return this.query.getAlert(alertId);
  }

  /**
   * enables/disables selected alerts
   * notes: needs to update legacy laAlertViewModels
   * @param enabled if alerts are enabled or disabled
   * @return - success message or error
   */
  enabledDisableSelectedAlerts(enabled: boolean): Observable<string | never> {
    try {
      const alerts: Array<AlertIdentifierRequest> = this.query.getActive()
        .map((alert: NxAlertManagement) => {
          if (alert instanceof NxAlertManagementHierarchical) {
            throw new Error('Cannot bulk update hierarchical alert');
          }
          return alert.transformToRequest();
        });
      let message: string;
      return this.alertIdentifiersService.updateAlerts(alerts, enabled)
        .pipe(
          switchMap((msg: string) => {
            message = msg;
            return combineLatest([
              this.alertIdentifiersService.selectAlertIdentifiers(),
              this.couriersService.selectCouriers(),
              this.webUiAlertsService.selectWebUiAlerts(),
              this.nodesService.selectNodes(),
              this.customOidsService.selectCustomOids()
            ]);
          }),
          take(1),
          map(([identifiers, couriers, webUiAlerts, nodes, customOids]:
                 [Array<AlertIdentifierResponse>, Array<Courier>, Array<WebUiAlert>, Array<Node>, Array<CustomOid>]) => {
            this.laAlertViewModels = this.rebuildLaAlertViewModels(identifiers, couriers, webUiAlerts, nodes, customOids);
            return message;
          })
        );
    } catch (err) {
      return throwError(err);
    }
  }

  /**
   * Update alert
   */
  update(alert: NxAlertManagement): Observable<void> {
    return this.couriersService.update(alert.sharing, alert.id)
      .pipe(
        switchMap((sharing: AlertSharing) => {
          alert.sharing = sharing;
          return this.alertIdentifiersService.update(alert.transformToRequest());
        }),
        map(() => void 0),
        catchError((err: HttpErrorResponse): Observable<DetailedError> => {
          this.logger.error(err.message);
          return throwError(new DetailedError('Error updating alert', err.message));
        })
      );
  }

  /**
   * Update store with the current set of selected/removed items
   */
  setActiveAlerts(alertIds: Array<string>): void {
    super.selectActiveItemIds(alertIds)
      .subscribe((selectedIds: Array<string>) => {
        this.store.setActive(selectedIds);
      });
  }

  reset(): void {
    super.clearFilters();
    this.store.reset();
    this.alertIdentifiersService.reset();
    this.couriersService.reset();
    this.webUiAlertsService.reset();
    this.nodesService.reset();
    this.customOidsService.reset();
  }

  // query
  selectFilteredAlerts(): Observable<Array<NxAlertManagement>> {
    return super.selectedFilteredItems();
  }

  // Get all active items from store regardless of selected filters
  selectActiveAlerts(): Observable<Array<NxAlertManagement>> {
    return this.query.selectActive();
  }

  // build
  private buildAlerts(identifiers: Array<AlertIdentifierResponse>,
                      couriers: Array<Courier>,
                      webUiAlerts: Array<WebUiAlert>,
                      nodes: Array<Node>,
                      customOids: Array<CustomOid>): Array<NxAlertManagement> {
    const alerts: Array<NxAlertManagement> = [];
    // group alerts by name for hierarchical alerts
    const groupAlerts: { [key: string]: Array<AlertIdentifierResponse> } = this.commonService.groupBy(identifiers, 'name');
    for (const groupAlertsKey in groupAlerts) {
      if (groupAlerts.hasOwnProperty(groupAlertsKey)) {
        const group: Array<AlertIdentifierResponse> = groupAlerts[groupAlertsKey];
        const alertType = ALERT_TYPES.find((at) => at.id === group[0].type);
        if (alertType !== void 0) {
          if (alertType.isHierarchical) {
            alerts.push(this.buildHierarchicalAlert(group, alertType, couriers, webUiAlerts, nodes, customOids));
          } else {
            group.forEach((alert: AlertIdentifierResponse) => {
              alerts.push(this.buildSingleAlert(alert, alertType, couriers, webUiAlerts, nodes, customOids));
            });
          }
        }

      }
    }
    return alerts;
  }

  private buildHierarchicalAlert(alertGroup: Array<AlertIdentifierResponse>,
                                 alertType: AlertType,
                                 couriers: Array<Courier>,
                                 webUiAlerts: Array<WebUiAlert>,
                                 nodes: Array<Node>,
                                 customOids: Array<CustomOid>): NxAlertManagement {
    const baseAlert = alertGroup.find((a: AlertIdentifierResponse) => a.rank === -1);
    if (baseAlert !== void 0) {
      const alertSharing: AlertSharing = this.alertManagementService.buildAlertCouriers(baseAlert, couriers, webUiAlerts);
      const alerts: Array<NxAlertManagement> = alertGroup.map((a: AlertIdentifierResponse) => {
        return this.buildSingleAlert(a, alertType, couriers, webUiAlerts, nodes, customOids);
      });
      return new NxAlertManagementHierarchical(
        {
          id: baseAlert.id,
          name: baseAlert.name,
          type: baseAlert.type,
          category: baseAlert.category,
          contributesToStatus: alertType.contributesToStatus,
          alerts: <Array<NxAlertManagement>>alerts,
          sharing: alertSharing,
          instanceName: baseAlert.instanceName
        }
      );
    }
  }

  private buildSingleAlert(alert: AlertIdentifierResponse,
                           alertType: AlertType,
                           couriers: Array<Courier>,
                           webUiAlerts: Array<WebUiAlert>,
                           nodes: Array<Node>,
                           customOids: Array<CustomOid>): NxAlertManagement {
    let config: NxAlertManagementConfig;
    if (alert.config !== void 0) {
      config = {
        thresholdComponent: alertType.thresholdComponent || ThresholdComponentOption.DEFAULT,
        thresholds: this.buildThresholds(alert, alertType, nodes, customOids) || [],
        timeOverMinutes: alert.config?.timeOverMinutes,
        filter: alert.config?.filter
      };
    }
    const alertSharing: AlertSharing = this.alertManagementService.buildAlertCouriers(alert, couriers, webUiAlerts);
    return new NxAlertManagement(
      {
        id: alert.id,
        name: alert.name,
        type: alert.type,
        category: alert.category,
        severity: alert.severity,
        enabled: alert.enabled,
        config: config,
        contributesToStatus: alertType.contributesToStatus,
        rank: alert.rank,
        description: alert.description,
        coolDownMinutes: alert.coolDownMinutes,
        instanceName: alert.instanceName,
        filterName: alert.filterName,
        sharing: alertSharing,
        useDefaultSharingConfig: alert.useDefaultSharingConfig
      }
    );
  }

  private buildThresholds(alert: AlertIdentifierResponse,
                          alertType: AlertType,
                          nodes: Array<Node>,
                          customOids: Array<CustomOid>): Array<NxAlertManagementConfigThreshold> {
    return alert.config.thresholds?.map((threshold: AlertIdentifierThresholdResponse) => {
      // find threshold in alert types mapping or take the first one
      let alertTypeThreshold: AlertThreshold;
      if (alertType?.thresholds?.length > 0) {
        alertTypeThreshold = alertType.thresholds.find((t: AlertThreshold) => {
          return t.name === this.commonService.startCase(threshold.label?.toLowerCase());
        }) ?? alertType.thresholds[0];
      }

      let customOid: CustomOid;
      if (alert.customOidId !== void 0) {
        customOid = customOids.find((cOid: CustomOid) => cOid.id === alert.customOidId);
      }
      let thresholdName = alertTypeThreshold?.name;
      const thresholdValue = threshold.value;
      const thresholdUnits = customOid?.units || alertTypeThreshold?.units;
      const thresholdComparator = alertTypeThreshold?.comparator;

      if (alertType.singleThresholdMultiNode) {
        // look up node name
        thresholdName = nodes.find((node: Node) => node.id === threshold.label)?.name || '';
      }

      return {
        label: threshold.label,
        severity: threshold.severity,
        value: thresholdValue,
        enabled: threshold.enabled,
        timeOverMinutes: threshold?.timeOverMinutes,
        units: thresholdUnits,
        comparator: thresholdComparator,
        name: thresholdName,
      } as NxAlertManagementConfigThreshold;
    });
  }

  /**
   * rebuilds laAlertViewModels for angularjs
   */
  private rebuildLaAlertViewModels(identifiers: Array<AlertIdentifierResponse>,
                                   couriers: Array<Courier>,
                                   webUiAlerts: Array<WebUiAlert>,
                                   nodes: Array<Node>,
                                   customOids: Array<CustomOid>): Array<any> {
    // this section is needed to build angularjs models
    this.laAlertViewModels = []; // clear
    const rawCouriers = couriers.map((courier: Courier) => {
      return courier.buildUpdateRequest();
    });
    return this.transformService.transformAlertsToViewModel(
      identifiers,
      rawCouriers,
      nodes,
      customOids,
      webUiAlerts);
  }
}
