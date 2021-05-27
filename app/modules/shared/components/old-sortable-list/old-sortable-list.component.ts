import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BaseContainer} from '../../../../containers/base-container/base.container';
import OldSortableList from './interfaces/old-sortable-list.interface';
import OldSortableListState from './interfaces/old-sortable-list-state.interface';
import OldSortableListAction from './interfaces/old-sortable-list-action.interface';
import {OLD_SORTABLE_LIST_ACTIONS_ENUM} from './enum/old-sortable-list-actions.enum';

@Component({
  selector: 'nx-old-sortable-list',
  templateUrl: './old-sortable-list.component.html',
  styleUrls: ['./old-sortable-list.component.less']
})
export class OldSortableListComponent extends BaseContainer<OldSortableListState> implements OnChanges {

  @Input() items: OldSortableList[];
  @Output() sortableChange = new EventEmitter<OldSortableList[]>();
  @Output() sortableAction = new EventEmitter<OldSortableListAction>();

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  public state: OldSortableListState = {items: void 0};

  constructor(public cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items && changes.items.currentValue) {
      this.setState({items: [...changes.items.currentValue]});
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const values = [...this.state.items];
    if (!values[event.currentIndex].disabled) {
      moveItemInArray(values, event.previousIndex, event.currentIndex);

      this.setState({items: values});
      this.sortableChange.emit(values);
    }
  }

  itemClick(item: OldSortableList) {
    if (item.active) {
      return;
    }
    this.sortableAction.emit({type: OLD_SORTABLE_LIST_ACTIONS_ENUM.CLICK, item: item});
  }
}
