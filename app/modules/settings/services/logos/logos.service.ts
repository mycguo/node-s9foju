import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {applyTransaction, EntityStore, QueryEntity} from '@datorama/akita';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import Logo from './models/logo';
import LogosConfiguration from './models/logos-configuration';
import {LogosState} from './models/logo-state';
import LogoManagementModalDataInterface from '../../components/logo-management-modal/logo-management-modal-data.interface';
import LaEscapeSpecialCharsFilter from '../../../../../../../client/app/filters/laEscapeSpecialChars.filter';
import {CommonService} from '../../../../utils/common/common.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class LogosService {
  public static readonly PREFIX_LOGO_FILE_URL = '/api/nx-no-auth/logos/';
  public static readonly POSTFIX_LOGO_FILE_URL = '/file';
  public static readonly NO_CUSTOM_LOGO = 'No Custom Logo';

  static readonly LOGOS_MULTIPART_URL = '/api/nx/multipart/logos';
  static readonly LOGOS_URL = '/api/nx/logos';
  private static readonly INITIAL_STATE = {
    active: null
  };
  private static readonly STORE_NAME = 'logos';

  constructor(private http: HttpClient,
              private logger: Logger,
              private commonService: CommonService,
              @Optional() private readonly store: EntityStore<LogosState>,
              @Optional() private readonly query: QueryEntity<LogosState, Logo, string>) {
    if (this.commonService.isNil(store)) {
      this.store = new EntityStore<LogosState>(LogosService.INITIAL_STATE, {name: LogosService.STORE_NAME});
    }
    if (this.commonService.isNil(query)) {
      this.query = new QueryEntity<LogosState, Logo, string>(this.store);
    }
  }

  selectLogos$(): Observable<Array<Logo>> {
    return this.query.selectAll();
  }

  selectActiveLogoId$(): Observable<string> {
    return <Observable<string>>this.query.selectActiveId();
  }

  selectError$(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectLoading$(): Observable<boolean> {
    return this.query.selectLoading();
  }

  /**
   * Get all logos
   */
  public getLogos$(): Observable<Array<Logo>> {
    this.store.setLoading(true);
    return this.http.get<{ defaultId: string, logos: Array<Logo> }>(LogosService.LOGOS_URL).pipe(
      tap((data: { defaultId: string, logos: Array<Logo> }) => {
        applyTransaction(() => {
          this.store.setError(void 0);
          this.store.set(data.logos);
          this.store.setActive(data.defaultId);
          this.store.setLoading(false);
        });
      }),
      map((data: { defaultId: string, logos: Array<Logo> }) => data.logos),
      catchError(this.errorHandler$.bind(this))
    );
  }

  private validateRequest(data: LogoManagementModalDataInterface): Error | void {
    if (data === void 0) {
      return new Error('Could not find form data');
    }
    if (data.id === void 0 && this.query.hasEntity((logo: Logo) => logo.name === data.name)) {
      return new Error(`${LaEscapeSpecialCharsFilter()(data.name)} already exists`);
    }
  }

  save$(data: LogoManagementModalDataInterface): Observable<void> {
    const error = this.validateRequest(data);
    if (error !== void 0) {
      return throwError(error);
    }

    if (data.id === void 0) {
      return this.addLogo$(data.name, data.file);
    } else {
      // update
      return this.updateLogo$(data.id, data.name, data.file);
    }
  }

  /**
   * Adding a Logo
   * @param fileName Name of file
   * @param file File
   * @param isDefault if logo should be default
   */
  private addLogo$(fileName: string, file: File, isDefault: boolean = false): Observable<void> {
    if (fileName === void 0 || file === void 0) {
      return throwError(new Error('Missing file name and/or file'));
    }
    this.store.setLoading(true);
    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', file);
    formData.append('isDefault', isDefault.toString());
    return this.http.post<Logo>(LogosService.LOGOS_MULTIPART_URL, formData).pipe(
      switchMap(() => this.getLogos$()),
      map(() => void 0),
      catchError((err) => {
        this.store.setLoading(false);
        return throwError(err);
      })
    );
  }

  /**
   * Updating a logo
   * @param id ID
   * @param fileName File name
   * @param file File
   * @param isDefault if logo should be default
   */
  private updateLogo$(id: string, fileName?: string, file?: File, isDefault?: boolean): Observable<void> {
    this.store.setLoading(true);
    let put$;
    const formData = new FormData();
    if (!this.commonService.isNil(file)) {
      formData.append('file', file);
    }
    if (!this.commonService.isNil(fileName)) {
      formData.append('name', fileName);
    }
    if (!this.commonService.isNil(isDefault)) {
      formData.append('isDefault', (isDefault !== void 0) ? isDefault.toString() : void 0);
    }
    put$ = this.http.put<Logo>(`${LogosService.LOGOS_MULTIPART_URL}/${id}`, formData);
    return put$.pipe(
      switchMap(() => this.getLogos$()),
      map(() => void 0),
      catchError((err) => {
        this.store.setLoading(false);
        return throwError(err);
      })
    );
  }

  /**
   * Delete Logo
   * @param id ID
   */
  public deleteLogo$(id: string): Observable<void> {
    this.store.setLoading(true);
    return this.http.delete(`${LogosService.LOGOS_URL}/${id}`).pipe(
      switchMap(() => this.getLogos$()),
      map(() => void 0),
      catchError((err) => {
        this.store.setLoading(false);
        return throwError(err);
      })
    );
  }

  /**
   * Update default selected logo
   * @param id ID of logo
   */
  public updateDefault$(id: string = null): Observable<{ id: string }> {
    this.store.setLoading(true);
    return this.http.put<{ id: string }>(`${LogosService.LOGOS_URL}/defaultId`, {id: id}).pipe(
      tap(() => {
        this.store.setLoading(false);
        this.store.setActive(id);
      })
    );
  }

  /**
   * Return configuration settings for uploading logos
   */
  public getLogoConfiguration$(): Observable<LogosConfiguration> {
    // todo use replay when http is setup
    return of({
      limit: 10,
      fileSize: 1048576,
      fileTypes: ['.jpg', '.jpeg', '.png'],
      ratio: {
        width: 8,
        height: 1
      }
    } as LogosConfiguration);
  }

  /**
   * Reset the error in the store
   */
  public resetErrorStore(): void {
    this.store.setError(void 0);
  }

  /**
   * Logo observable error handler
   * @param err Http Error
   */
  private errorHandler$(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
