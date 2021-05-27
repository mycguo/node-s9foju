import {Injectable, OnDestroy} from '@angular/core';
import {applyTransaction, EntityStore, QueryEntity} from '@datorama/akita';
import AnalyticsPlatformMonitoredAppGroupState from './analytics-platform-monitored-app-group.state';
import {SimpleFilterService} from '../../table-filter/simple-filter.service';
import {EntityQueryable} from '../../../modules/grid/services/grid-string-filter/entity-queryable';
import {ResettableService} from '../../resettable-service';
import {AnalyticsPlatformRestClientService} from '../../analytics-platform-rest-client/analytics-platform-rest-client.service';
import {map, take} from 'rxjs/operators';
import {RequestErrors} from '../../../utils/api/request-errors';
import RequestType from '../../../utils/api/request-type.enum';
import NxResponseUtil from '../../../utils/api/nx-response.util';
import AnalyticsPlatformMonitoredAppGroupResponse from './analytics-platform-monitored-app-group-response';
import {Observable} from 'rxjs';
import GridData from '../../../modules/grid/models/grid-data.model';
import {AnalyticsPlatformMonitoredAppGroup} from './analytics-platform-monitored-app-group';
import {AnalyticsPlatformMonitoredAppGroupApplication} from './analytics-platform-monitored-app-group-application';
import {Logger} from '../../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPlatformMonitoredAppGroupService
  extends SimpleFilterService<AnalyticsPlatformMonitoredAppGroupState, AnalyticsPlatformMonitoredAppGroup>
  implements OnDestroy, EntityQueryable<AnalyticsPlatformMonitoredAppGroupState>, ResettableService {
  private static readonly ALLOWABLE_GLOBAL_FILTER_KEYS: Array<string> =
    ['name', 'applications'];

  static readonly monitoredAppGroupStore: EntityStore<AnalyticsPlatformMonitoredAppGroupState> =
    new EntityStore<AnalyticsPlatformMonitoredAppGroupState>({
      active: []
      },
      {name: 'AnalyticsPlatformMonitoredAppGroups', idKey: 'id', resettable: true});

  static readonly monitoredAppGroupQuery: QueryEntity<AnalyticsPlatformMonitoredAppGroupState> =
    new QueryEntity<AnalyticsPlatformMonitoredAppGroupState>(AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore);

  constructor(
    private analyticsApiClient: AnalyticsPlatformRestClientService,
    private logger: Logger,
  ) {
    super(AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupQuery,
      'AnalyticsPlatformMonitoredAppGroupFilters', 'id', AnalyticsPlatformMonitoredAppGroupService.ALLOWABLE_GLOBAL_FILTER_KEYS);
  }

  /**
   * A handle to the query
   */
  getEntityQuery(): QueryEntity<AnalyticsPlatformMonitoredAppGroupState> {
    return AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupQuery;
  }

  /**
   * Convert all applications within an application group to a single string
   * @param applications - the list of applications within an application group
   */
  private applicationsToString(applications: Array<AnalyticsPlatformMonitoredAppGroupApplication>): string {
    return applications?.map((app) => app.name)
      .reduce((returnString, appName, index) => {
        // Add a ',' if this is not the 1st element
        if (index > 0) {
          return `${returnString}, ${appName}`;
        } else {
          return appName;
        }
      });
  }

  /**
   * Converts the application group response into the client store model
   */
  private convertToStoreModel(appGroups: Array<AnalyticsPlatformMonitoredAppGroupResponse>):
    Array<AnalyticsPlatformMonitoredAppGroup> {
    if (appGroups == null) {
      return [];
    } else {
      return appGroups.map((appGroup: AnalyticsPlatformMonitoredAppGroupResponse) => {
        return {
          id: appGroup.id,
          name: appGroup.name,
          applications: this.applicationsToString(appGroup.applications)
        };
      });
    }
  }

  /**
   * Triggers a fetch action for the analytics monitored application groups.
   */
  fetchMonitoredApplicationGroups() {
    super.clearFilters();
    AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.setLoading(true);
    this.analyticsApiClient.getMonitoredAppGroups()
      .pipe(
        take(1),
        map((response) => this.convertToStoreModel.bind(this)(response.applicationGroups)),
      )
      .subscribe(
        (response: Array<AnalyticsPlatformMonitoredAppGroup>) => {
          applyTransaction(() => {
            AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.set(response);
            AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.setLoading(false);
          });
        },
        err => {
          this.logger.error(err);
          const requestErrors = <RequestErrors>{
            requestType: RequestType.GET,
            errorMessage: NxResponseUtil.parseErrorMessage(err)
          };
          applyTransaction(() => {
            AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.setLoading(false);
            AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.setError(requestErrors);
          });
        }
      );
  }

  /**
   * Remove application groups from being monitored
   * @param groupIds - the application group id's to be removed from monitoring
   */
  removeApplicationGroups(groupIds: Array<string>): Observable<any> {
    return new Observable<any>((obs) => {
      this.analyticsApiClient.removeMonitoredAppGroups(groupIds)
        .pipe(take(1))
        .subscribe(
          result => {
            applyTransaction(() => {
              AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.remove(groupIds);
            });
            return obs.next(result);
          },
          error => {
            const requestErrors = <RequestErrors>{
              requestType: RequestType.DELETE,
              errorMessage: NxResponseUtil.parseErrorMessage(error)
            };
            return obs.error(requestErrors);
          }
        );
    });
  }

  selectFilteredDataAsGrid$() {
    return super.selectedFilteredItems()
      .pipe(
        map((dataArray => new GridData(dataArray)))
      );
  }

  /**
   * Returns the loading state observable for the monitored applications.
   */
  selectLoading(): Observable<boolean> {
    return AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupQuery.selectLoading();
  }

  /**
   * Return an observable for errors generated when retrieving monitored applications.
   */
  selectError(): Observable<RequestErrors> {
    return AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupQuery.selectError();
  }

  ngOnDestroy(): void {
  }

  /**
   * Clean up everything
   */
  resetStores(): void {
    super.clearFilters();
    AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.reset();
  }

  /**
   * Set the selected application groups
   */
  setSelectedEntities(selectedAppGroups: Array<string>) {
    super.selectActiveItemIds(selectedAppGroups)
      .subscribe((selectedIds: Array<string>) => {
        AnalyticsPlatformMonitoredAppGroupService.monitoredAppGroupStore.setActive(selectedIds);
      });
  }

  selectFilteredActiveRows(): Observable<string[]> {
    return super.selectActiveId();
  }

  /**
   * Gets the currently selected application groups ids
   */
  selectSelectedAppGroupsIds(): Observable<Array<string>> {
    return this.query.selectActiveId();
  }
}
