import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CommonService} from '../../../../utils/common/common.service';
import {EntityStore, QueryEntity} from '@datorama/akita';
import {Observable, of, throwError} from 'rxjs';
import {ReportInfoState} from './models/report-info-state';
import {ReportInfoValue} from '../../models/report-info';
import {catchError, finalize, map, take} from 'rxjs/operators';
import ReportCategoryParameter from '../../models/api/parameter-enums/report-category-parameter';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ClientErrorHandler} from '../../../../utils/client-error-handler/client-error-handler';
import {ReportTreeType} from '../../../shared/components/report-accordion-select/models/report-tree-type';
import {ReportTreeGroup} from '../../../shared/components/report-accordion-select/models/report-tree-group';
import {ReportTreeItem} from '../../../shared/components/report-accordion-select/models/report-tree-item';
import ReportId from '../../models/api/response/sub/report-id';
import {CustomReportTreeGroup} from './models/custom-report-tree-group';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ReportInfoService {
  static readonly REPORT_INFO_ENDPOINT = '/api/nx/reports';
  static readonly INITIAL_STATE = {};
  static readonly STORE_NAME = 'report-info';

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private logger: Logger,
              @Optional() private readonly store: EntityStore<ReportInfoState>,
              @Optional() private readonly query: QueryEntity<ReportInfoState>) {
    if (commonService.isNil(store)) {
      this.store = new EntityStore(ReportInfoService.INITIAL_STATE, {
        name: ReportInfoService.STORE_NAME,
        idKey: '_id',
        resettable: true
      });
    }
    // set up custom ID
    this.store.akitaPreAddEntity = ((reportInfoValue: Readonly<ReportInfoValue>) => {
      return {
        ...reportInfoValue,
        _id: this.buildId(reportInfoValue.id, reportInfoValue.reportCategory) // custom id
      };
    }).bind(this);

    if (commonService.isNil(query)) {
      this.query = new QueryEntity<ReportInfoState>(this.store);
    }
  }

  public reset(): void {
    this.store.reset();
  }

  public selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  public selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  public selectReports(): Observable<Array<ReportInfoValue>> {
    return this.query.selectAll();
  }

  /**
   * get specific report info value from report id and category
   */
  public getReportInfoById(id: number, category: ReportCategoryParameter): Observable<ReportInfoValue> {
    if (this.query.getCount() > 0) {
      return of(this.query.getEntity(this.buildId(id, category)));
    } else {
      return this.getReportInfo()
        .pipe(
          take(1),
          map((reportInfos: Array<ReportInfoValue>) => {
            return reportInfos.find((reportInfo: ReportInfoValue) => {
              // ensure IDs are compared to as string as it could be
              return reportInfo.id.toString() === id.toString() && reportInfo.reportCategory === category;
            });
          })
        );
    }
  }

  /**
   * return all report info values and fetch if there are none
   */
  public getReportInfo(): Observable<Array<ReportInfoValue>> {
    this.store.setLoading(true);
    return this.http.get<{ meta: Object, reports: Array<ReportInfoValue> }>(ReportInfoService.REPORT_INFO_ENDPOINT)
      .pipe(
        take(1),
        map((resp: { meta: Object, reports: Array<ReportInfoValue> }) => {
          const reports = resp.reports;
          this.store.set(reports);
          return reports;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          const error = ClientErrorHandler.buildDetailedError(err);
          this.store.setError<DetailedError>(error);
          this.logger.error(err.message);
          return throwError(err);
        }),
        finalize(() => this.store.setLoading(false))
      );
  }

  /**
   * Filters a report tree based on the searchString
   */
  public searchReportTree(t: Array<ReportTreeType>, searchString: string): Array<ReportTreeType> {
    const tree = this.commonService.cloneDeep(t);
    if (searchString == null || searchString === '') {
      return tree;
    } else {
      return tree.filter((type: ReportTreeType) => {
        return this.treeTypeMatches(type, searchString);
      });
    }
  }

  /**
   * returns true if searchString is found in report tree level or in children
   */
  private treeTypeMatches(type: ReportTreeType, searchString: string): boolean {
    const typeMatches = this.commonService.randomOrderSearch(type.name, searchString);
    if (typeMatches) {
      return true;
    } else {
      type.children = type.children.filter((group: ReportTreeGroup) => {
        return this.treeGroupMatches(group, searchString);
      });
      if (type.children.length > 0) {
        return true;
      }
    }
  }

  /**
   * Returns true if searchString is found in report tree group
   */
  private treeGroupMatches(group: ReportTreeGroup, searchString: string): boolean {
    const groupMatches = this.commonService.randomOrderSearch(group.name, searchString);
    if (groupMatches) {
      return true;
    } else if (group.children == null) {
      return false;
    } else {
      group.children = group.children.filter((item: ReportTreeItem) => {
        return this.commonService.randomOrderSearch(item.name, searchString);
      });
      if (group.children.length > 0) {
        return true;
      }
    }
    return this.commonService.randomOrderSearch(group.name, searchString);
  }
  /**
   * Convert list of reports into report tree
   */
  public reportsToTree(reports: Array<ReportInfoValue>, customGroup?: CustomReportTreeGroup): Array<ReportTreeType> {
    const grouped: { [key: string]: Array<ReportInfoValue> } =
      this.commonService.groupBy(this.updateSpecialCaseReportCategories(reports), 'reportCategory');
    const categoryKeys = Object.values(ReportCategoryParameter);
    let tree: Array<ReportTreeType> = [];
    Object.keys(grouped).forEach((key: ReportCategoryParameter) => {
      tree.push({
        name: this.getReportCategoryName(key),
        sort: categoryKeys.indexOf(grouped[key][0].reportCategory),
        children: this.buildReportGroup(grouped[key])
      } as ReportTreeType);
    });

    tree = tree.sort((a: ReportTreeType, b: ReportTreeType): number => {
      return a.sort - b.sort;
    });

    if (customGroup != null) {
      const customGroupChildren: Array<ReportInfoValue> = customGroup.reportIds
        .map((reportId: ReportId): ReportInfoValue => {
          const foundReport: ReportInfoValue = reports.find((rpt: ReportInfoValue) => {
            return rpt.id === reportId.id && rpt.reportCategory === reportId.category;
          });
          if (foundReport == null) {
            return void 0;
          }
          // remove group when custom
          return {
            ...foundReport,
            group: void 0
          } as ReportInfoValue;
        })
        .filter((rpt: ReportInfoValue) => rpt != null);
      const customType: ReportTreeType = {
        name: customGroup.groupName,
        sort: -1,
        children: this.buildReportGroup(customGroupChildren)
      };
      tree.unshift(customType);
    }
    return tree;
  }

  private buildId(id: number | string, category: ReportCategoryParameter): string {
    return [category, id].join('-');
  }

  /**
   * This function will return the correct name of the report's category name
   * @param category - BE enum for report category
   */
  public getReportCategoryName(category: ReportCategoryParameter): string {
    switch (category) {
      case ReportCategoryParameter.ANALYTICS:
        return 'LiveNA';
      case ReportCategoryParameter.QOS:
        return 'SNMP';
      case ReportCategoryParameter.VIPTELA:
        return 'Cisco SD-WAN';
      default:
        return this.commonService.startCase(category);
    }
  }

  /**
   * Used to build a list of ReportTreeGroups or ReportTreeItems
   * The heterogeneous return type is because a report could be a standalone report or part of a particular group
   */
  private buildReportGroup(categoryReports: Array<ReportInfoValue>): Array<ReportTreeGroup | ReportTreeItem> {
    const groupedReports = this.commonService.groupBy(categoryReports, 'group');
    const treeGroup: Array<ReportTreeGroup | ReportTreeItem> = [];

    // if no group, push directly and first
    const undefinedGroup = groupedReports['undefined'];
    if (undefinedGroup != null && undefinedGroup.length > 0) {
      undefinedGroup.forEach((rpt: ReportInfoValue) => {
        treeGroup.push(this.buildReportTreeItem(rpt));
      });
      delete groupedReports['undefined'];
    }
    Object.keys(groupedReports).forEach((key: string) => {
      treeGroup.push({
        name: key,
        children: groupedReports[key]
          .map((rpt: ReportInfoValue): ReportTreeItem => {
            return this.buildReportTreeItem(rpt);
          })
          .sort(this.sortFn)
      });
    });
    return treeGroup.sort(this.sortFn);
  }

  private buildReportTreeItem(report: ReportInfoValue): ReportTreeItem {
    return {
      name: report.name,
      value: report
    } as ReportTreeItem;
  }

  private updateSpecialCaseReportCategories(reports: Array<ReportInfoValue>): Array<ReportInfoValue> {
    return reports.map((report: ReportInfoValue) => {
      let reportCategory = report.reportCategory;
      // IPSLA should be in QOS category
      if (report.reportCategory === ReportCategoryParameter.IPSLA) {
        reportCategory = ReportCategoryParameter.QOS;
      }
      // Engineering Console Alerts should be in alerts
      if (report.reportCategory === ReportCategoryParameter.QOS && report.group === 'Engineering Console Alerts') {
        reportCategory = ReportCategoryParameter.ALERT;
      }
      return {
        ...report,
        reportCategory: reportCategory
      };
    });
  }

  private sortFn(a: ReportTreeGroup | ReportTreeItem, b: ReportTreeGroup | ReportTreeItem) {
    if (a.name === b.name) {
      return 0;
    } else if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  }
}
