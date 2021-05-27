import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import Logo from '../../services/logos/models/logo';
import {LogosService} from '../../services/logos/logos.service';

@Component({
  selector: 'nx-logos-list',
  templateUrl: './logos-list.component.html',
  styleUrls: ['./logos-list.component.less']
})
export class LogosListComponent implements OnInit {
  readonly prefixLogoUrl = LogosService.PREFIX_LOGO_FILE_URL;
  readonly postfixLogoUrl = LogosService.POSTFIX_LOGO_FILE_URL;
  readonly noCustomLogo = LogosService.NO_CUSTOM_LOGO;

  @Input() logos: Array<Logo>;
  @Input() activeLogoId: string;

  @Output() changeLogo: EventEmitter<Logo> = new EventEmitter();
  @Output() deleteLogo: EventEmitter<Logo> = new EventEmitter();
  @Output() selectLogo: EventEmitter<Logo> = new EventEmitter();
  @Output() selectEmptyLogo: EventEmitter<any> = new EventEmitter();

  /**
   * @ignore
   */
  constructor() {
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

  /**
   * When edit of a logo is clicked
   * @param logoObj Logo
   */
  public changeLogoClick(logoObj: Logo) {
    this.changeLogo.emit(logoObj);
  }

  /**
   * When delete of a logo is clicked
   * @param logoObj Logo
   */
  public deleteLogoClick(logoObj: Logo) {
    this.deleteLogo.emit(logoObj);
  }

  /**
   * When a logo is set to default
   * @param logo Logo
   */
  public logoClick(logo: Logo) {
    if (logo.id === this.activeLogoId) {
      return;
    }
    this.selectLogo.emit(logo);
  }

  /**
   * If no custom logo is set to default
   */
  public noLogoClick() {
    this.selectEmptyLogo.emit();
  }

}
