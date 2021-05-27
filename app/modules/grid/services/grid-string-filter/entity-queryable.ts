import {QueryEntity} from '@datorama/akita';

export interface EntityQueryable<T> {
  getEntityQuery(): QueryEntity<T>;
}
