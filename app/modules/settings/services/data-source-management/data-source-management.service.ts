import { Injectable } from '@angular/core';
import { DataSourceStore } from './data-source.store';
import { DataSourceQuery } from './data-source.query';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, take } from 'rxjs/operators';
import { FlexSearchApiResponse } from './flexSearchApiResponse';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class DataSourceManagementService {

  private static readonly URL = '/api/nx/reports/longTermReports/flexsearch';

  constructor(private store: DataSourceStore,
              private query: DataSourceQuery,
              private httpClient: HttpClient) { }

  public get flexFilter$(): Observable<string> {
    return this.query.selectFlexFilter$;
  }

  public get isFlexFilterLoading$(): Observable<boolean> {
    return this.query.selectLoading();
  }

  public get error$(): Observable<Error> {
    return this.query.selectError<Error>();
  }

  public resetStore(): void {
    this.store.reset();
  }

  public getFlexFilter(): void {
    this.store.setLoading(true);

    this.httpClient.get<FlexSearchApiResponse>(DataSourceManagementService.URL)
      .pipe(
        take(1),
        catchError((httpErr: HttpErrorResponse) => {
          const reqError = new Error('Unable to get flex filter');
          this.store.setError<Error>(reqError);
          throw reqError;
        }),
        finalize(() => this.store.setLoading(false))
      )
      .subscribe((apiResponse: FlexSearchApiResponse) => {
        this.store.update({ flexFilter: apiResponse.flexSearch });
      });
  }

  public updateFlexFilter(flexFilter: string): Observable<FlexSearchApiResponse> {
    this.store.setLoading(true);

    return this.httpClient.post(DataSourceManagementService.URL, { flexSearch: flexFilter })
      .pipe(
        take(1),
        tap((apiResponse: FlexSearchApiResponse) => {
          this.store.update({ flexFilter: apiResponse.flexSearch });
        }),
        catchError(() => {
          const reqError = new Error('Unable to update flex filter');
          this.store.setError<Error>(reqError);
          throw reqError;
        }),
        finalize(() => this.store.setLoading(false))
      );
  }
}
