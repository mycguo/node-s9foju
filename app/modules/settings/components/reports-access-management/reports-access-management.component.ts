import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SimpleInputModel } from '../../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import { SelectableTreeNode } from '../../../shared/components/selectable-tree/selectable-tree-node';
import { SelectableTreeFlatNode } from '../../../shared/components/selectable-tree/selectable-tree-flat-node';
import { debounceTime, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'nx-reports-access-management',
  templateUrl: './reports-access-management.component.html',
  styleUrls: ['./reports-access-management.component.less']
})
export class ReportsAccessManagementComponent implements OnInit, OnChanges {

  @Input() treeData: Array<SelectableTreeNode>;
  @Input() selectAllDisabled: boolean;
  @Input() unselectAllDisabled: boolean;

  @Output() searchChange = new EventEmitter<string>();
  @Output() treeSelect = new EventEmitter<SelectableTreeFlatNode[]>();
  @Output() selectAll = new EventEmitter();
  @Output() unselectAll = new EventEmitter();
  @Output() submit = new EventEmitter();

  searchControl: FormControl;
  treeControl: FormControl;
  inputModel: SimpleInputModel;
  searchString$: Observable<string>;
  isUnselectAllDisabled: boolean;

  constructor() {
    this.searchControl = new FormControl(null);
    this.treeControl = new FormControl(null);
  }

  ngOnInit(): void {
    this.inputModel = new SimpleInputModel(
      HtmlInputTypesEnum.search,
      null,
      'Search...'
    );
    this.searchString$ = this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        tap((searchString: string) => this.searchChange.emit(searchString))
      );

    this.treeControl.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((nodes: SelectableTreeFlatNode[]) => {
        this.treeSelect.emit(nodes);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.treeData?.currentValue) {
      this.treeControl.setValue(this.treeData, {emitEvent: false});
    }
  }

  handleSelectAll() {
    this.treeControl.markAsDirty();
    this.selectAll.emit();
  }

  handleUnselectAll() {
    this.treeControl.markAsDirty();
    this.unselectAll.emit();
  }

  handleApply() {
    this.submit.emit();
    this.treeControl.markAsPristine();
  }
}
