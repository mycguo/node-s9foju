import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import IntegrationTitlesEnum from '../../enums/integration-title.enum';
import IIntegrationsDisplay from '../integrations-display/IIntegrationsDisplay';
import { CommonService } from '../../../../utils/common/common.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {NotificationLabelStatus} from '../../../shared/components/notification-label/enums/notification-label-status.enum';

@Component({
  selector: 'nx-livenca-integrations',
  templateUrl: './livenca-integrations.component.html',
  styleUrls: ['./livenca-integrations.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LivencaIntegrationsComponent implements OnChanges {
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() displayState: IntegrationDisplayStateEnum;
  @Input() data: { hostname: string, isStale: boolean };


  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<{ hostname: string }>();
  @Output() cancel = new EventEmitter<void>();

  baseTitle = IntegrationTitlesEnum.LIVENCA;
  integrationData: Array<IIntegrationsDisplay>;
  notificationStatus = NotificationLabelStatus.WARNING;
  isStalePage: boolean; // Whether the page is updated and needs to be refreshed
  IntegrationDisplayStateEnum = IntegrationDisplayStateEnum;

  constructor(private commonService: CommonService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.data?.currentValue)) {
      const data: { hostname: string, isStale: boolean } = changes.data.currentValue;
      this.integrationData = [
        {name: 'Hostname', value: data.hostname || ''},
      ];
      this.isStalePage = data.isStale;
    }
  }

  public reloadPage(): void {
    window.location.reload();
  }
}
