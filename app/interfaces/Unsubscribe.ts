import {Subject} from 'rxjs';

export default interface Unsubscribe {
  unsubscribe$: Subject<void>;
  ngOnDestroy: () => void;
}
