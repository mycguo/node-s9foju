import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, TemplateRef,
} from '@angular/core';
import IIntegrationsDisplay from '../../integrations-display/IIntegrationsDisplay';
import {ButtonModel} from '../../../../shared/components/button/button.model';
import {KeyValueListItemDirective} from '../../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';

@Component({
  selector: 'nx-common-integrations-display',
  templateUrl: './common-integrations-display.component.html',
  styleUrls: ['./common-integrations-display.component.less']
})
export class CommonIntegrationsDisplayComponent implements OnInit {

  @Input() integrations: Array<IIntegrationsDisplay>;
  @Input() customValueViews: Array<KeyValueListItemDirective>;
  @Input() displayContent: TemplateRef<any>;
  @Input() actionButtons: Array<ButtonModel>;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }
}
