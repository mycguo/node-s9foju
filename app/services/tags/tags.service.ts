import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {applyTransaction, EntityStore, QueryEntity} from '@datorama/akita';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {TagsState} from './models/tags-state';
import {Tag} from './models/tag';
import DetailedError from 'src/app/modules/shared/components/loading/detailed-error';
import {Logger} from '../../modules/logger/logger';

/**
 * Return all the different tags on the devices/interfaces in LiveNX
 * Usage:
 * tagsService.getTags().subscribe();
 * selectAllTags$ = tagsService.selectAll();
 */
@Injectable({
  providedIn: 'root'
})
export class TagsService {

  static readonly TAGS_ENDPOINT = '/api/nx/tags';

  static readonly store: EntityStore<TagsState> =
    new EntityStore<TagsState>({}, {name: 'tags', idKey: 'tagName' });
  static readonly query: QueryEntity<TagsState> =
    new QueryEntity<TagsState>(TagsService.store);

    constructor(
    private http: HttpClient,
    private logger: Logger,
  ) { }

  getTags(): Observable<Tag[]> {
    TagsService.store.setLoading(true);

    return this.http.get<{ meta: Object, tags: Tag[] }>(TagsService.TAGS_ENDPOINT)
      .pipe(
        map((resp) => {
          applyTransaction(() => {
            TagsService.store.set(resp.tags);
            TagsService.store.setError(void 0);
            TagsService.store.setLoading(false);
          });
          return resp.tags;
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  selectAll(): Observable<Tag[]> {
    return TagsService.query.selectAll();
  }

  selectLoading(): Observable<boolean> {
    return TagsService.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return TagsService.query.selectError();
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      TagsService.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      TagsService.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
