import {QueryEntity} from '@datorama/akita';
import {EntityQueryable} from '../services/grid-string-filter/entity-queryable';

export class GridDataSource implements EntityQueryable<any> {
  getEntityQuery(): QueryEntity<any> { return null; }
}
