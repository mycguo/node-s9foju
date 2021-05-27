import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { KeyValueListItemDirective } from './key-value-list-item/key-value-list-item.directive';

@Component({
  selector: 'nx-key-value-list',
  templateUrl: './key-value-list.component.html',
  styleUrls: ['./key-value-list.component.less']
})
export class KeyValueListComponent {
  @Input() inline: boolean; // show each item from left to right
  @Input() spread: boolean;
  @ContentChildren(KeyValueListItemDirective) items: QueryList<KeyValueListItemDirective>;
}
