import {EntityState} from '@datorama/akita';
import {Tag} from './tag';

export interface TagsState extends EntityState<Tag, string> {
}
