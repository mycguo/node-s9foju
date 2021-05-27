import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {CommonService} from '../../../../utils/common/common.service';
import {applyTransaction, EntityStore, guid, QueryEntity} from '@datorama/akita';
import {ServiceNowFieldsState} from './models/service-now-fields-state';
import {ServiceNowFieldResponse} from './models/service-now-field-response';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {ServiceNowField} from './models/service-now-field';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ClientErrorHandler} from '../../../../utils/client-error-handler/client-error-handler';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ServiceNowFieldsService {
  static readonly SERVICE_NOW_FIELDS_URL = '/api/nx/serviceNow/fields';
  static readonly STORE_NAME = 'serviceNowFields';

  static readonly INITIAL_STATE = {
    loading: false,
    active: null,
    error: null
  };

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private logger: Logger,
              @Optional() private readonly store: EntityStore<ServiceNowFieldsState, ServiceNowFieldResponse>,
              @Optional() private readonly query: QueryEntity<ServiceNowFieldsState>) {
    if (this.commonService.isNil(store)) {
      this.store = new EntityStore<ServiceNowFieldsState>(ServiceNowFieldsService.INITIAL_STATE, {
        name: ServiceNowFieldsService.STORE_NAME,
        resettable: true
      });
    }
    if (this.commonService.isNil(query)) {
      this.query = new QueryEntity<ServiceNowFieldsState, ServiceNowFieldResponse, string>(this.store);
    }
  }

  selectFieldsRaw(): Observable<Array<ServiceNowFieldResponse>> {
    return this.query.selectAll();
  }

  selectFields(): Observable<Array<ServiceNowField>> {
    return this.query.selectAll()
      .pipe(
        map((fields: Array<ServiceNowFieldResponse>) => {
          return this.buildFieldHierarchy(fields).sort((a: ServiceNowField, b: ServiceNowField) => {
            if (a.displayValue === b.displayValue) {
              return 0;
            } else {
              return a.displayValue > b.displayValue ? 1 : -1;
            }
          });
        })
      );
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  public reset(): void {
    this.store.reset();
  }

  findFieldByName(name: string): ServiceNowFieldResponse {
    // ensuring returning only one element
    return this.query.getAll({
      filterBy: ({fieldName}) => fieldName === name
    }).shift();
  }

  isEmpty(): boolean {
    return this.query.getAll().length === 0;
  }

  /**
   * Fetches all fields
   */
  getFields(queryRequiredOnly = false): Observable<Array<ServiceNowFieldResponse>> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });

    const params = new HttpParams({
      fromObject: {
        queryRequiredOnly: queryRequiredOnly.toString()
      }
    });
    return this.http.get<{ fields: Array<ServiceNowFieldResponse> }>(ServiceNowFieldsService.SERVICE_NOW_FIELDS_URL,
      {params: params})
      .pipe(
        map((resp: { fields: Array<ServiceNowFieldResponse> }) => {
          return resp.fields
            .map((field: ServiceNowFieldResponse) => {
              return ({id: guid(), ...field});
            })
            .filter((field: ServiceNowFieldResponse) => {
              // [LD-28825]
              return !(field.isDependentOnField && field.isReference);
            });
        }),
        tap((fields: Array<ServiceNowFieldResponse>) => {
          this.store.set(fields);
        }),
        catchError(this.errorHandler.bind(this)),
        finalize(() => this.store.setLoading(false))
      );
  }

  /**
   * Flattens nested service now field without ids
   */
  flattenServiceNowField(field: ServiceNowField): Array<ServiceNowFieldResponse> {
    if (field.child == null) {
      return [{
        fieldName: field.fieldName,
        displayValue: field.displayValue,
        defaultValue: field.defaultValue,
        isReference: field.isReference,
        referenceTableName: field.referenceTableName,
        isDependentOnField: field.isDependentOnField,
        dependentField: field.dependentField
      } as ServiceNowFieldResponse];
    } else {
      return [
        ...this.flattenServiceNowField(field.child),
        {
          fieldName: field.fieldName,
          displayValue: field.displayValue,
          defaultValue: field.defaultValue,
          isReference: field.isReference,
          referenceTableName: field.referenceTableName,
          isDependentOnField: field.isDependentOnField,
          dependentField: field.dependentField
        } as ServiceNowFieldResponse];
    }
  }

  /**
   * Converts array of ServiceNowFieldResponse into array of ServiceNowField (which is hierarchical)
   */
  private buildFieldHierarchy(fields: Array<ServiceNowFieldResponse>): Array<ServiceNowField> {
    const hierarchy: Array<ServiceNowField> = [];
    fields
      .filter((field: ServiceNowFieldResponse) => !field.isDependentOnField)
      .map((field: ServiceNowFieldResponse) => {
        hierarchy.push(new ServiceNowField({
          ...field,
          id: field.id,
          child: this.buildChild(fields, field.fieldName),
          parentName: void 0
        }));
      });
    return hierarchy;
  }

  /**
   * Builds ServiceNowField that matches fieldName (used to build hierarchy)
   */
  private buildChild(fields: Array<ServiceNowFieldResponse>, fieldName: string): ServiceNowField {
    const child: ServiceNowFieldResponse = fields.find((field: ServiceNowFieldResponse) => field.dependentField === fieldName);
    if (child == null) {
      return void 0;
    } else {
      return new ServiceNowField({
        ...child,
        id: child.id,
        child: this.buildChild(fields, child.fieldName),
        parentName: fieldName
      });
    }
  }

  private errorHandler(err: HttpErrorResponse): Observable<DetailedError> {
    const detailedError = ClientErrorHandler.buildDetailedError(err);
    this.store.setError<DetailedError>(detailedError);
    this.logger.error(detailedError.message);
    return throwError(detailedError);
  }
}
