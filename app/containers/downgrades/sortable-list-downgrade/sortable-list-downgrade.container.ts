import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import OldSortableList from '../../../modules/shared/components/old-sortable-list/interfaces/old-sortable-list.interface';
import {OLD_SORTABLE_LIST_ACTIONS_ENUM} from '../../../modules/shared/components/old-sortable-list/enum/old-sortable-list-actions.enum';
import OldSortableListAction from '../../../modules/shared/components/old-sortable-list/interfaces/old-sortable-list-action.interface';
import {BaseContainer} from '../../base-container/base.container';
import OldSortableListState from '../../../modules/shared/components/old-sortable-list/interfaces/old-sortable-list-state.interface';
import SetElementState from '../SetElementState.interface';
import {ToggleModel} from '../../../modules/shared/components/form/toggle/models/toggle.model';

@Component({
  selector: 'nx-sortable-list-downgrade-container',
  templateUrl: './sortable-list-downgrade.container.html',
  styleUrls: ['./sortable-list-downgrade.less']
})
export class SortableListDowngradeContainer extends BaseContainer<OldSortableListState> implements SetElementState<OldSortableListState> {

  SORTABLE_LIST_ACTIONS_ENUM: typeof OLD_SORTABLE_LIST_ACTIONS_ENUM = OLD_SORTABLE_LIST_ACTIONS_ENUM;

  public state: OldSortableListState = {
    items: void 0,
    showSwitchers: true
  };

  toggleModel: ToggleModel;

  @Output() sortableChange = new EventEmitter<OldSortableList[]>();
  @Output() sortableAction = new EventEmitter<OldSortableListAction>();

  @Input() setElementState = (state) => this.stateInput(state);

  constructor(public cd: ChangeDetectorRef) {
    super(cd);

    this.toggleModel = new ToggleModel('Enabled', 'Disabled');
  }

  stateInput(state: OldSortableListState): void {
    if (!state) {
      return;
    }
    this.setState({
      items: [...state.items],
      showSwitchers: state.showSwitchers});

    // hack to update toggle on state change should be removed after migrating to pure Angular component
    setTimeout(() => {
      this.cd.detectChanges();
    });
  }

  bubbleChange(change: OldSortableList[]): void {
    this.sortableChange.emit(change);
  }

  itemAction(event: OldSortableListAction): void {
    this.sortableAction.emit(event);
  }
}
