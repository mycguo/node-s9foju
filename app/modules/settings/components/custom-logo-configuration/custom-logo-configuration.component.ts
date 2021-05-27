import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LogoManagementModalContainer} from '../../containers/logo-edit-modal/logo-management-modal.container';
import LogosConfiguration from '../../services/logos/models/logos-configuration';
import LogoManagementModalDataInterface from '../logo-management-modal/logo-management-modal-data.interface';
import Logo from '../../services/logos/models/logo';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {FormControl} from '@angular/forms';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';
import {filter, startWith, switchMap, take} from 'rxjs/operators';
import {CommonService} from '../../../../utils/common/common.service';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { Size } from '../../../shared/enums/size';
import DetailedError from '../../../shared/components/loading/detailed-error';

@Component({
  selector: 'nx-custom-logo-configuration',
  templateUrl: './custom-logo-configuration.component.html',
  styleUrls: ['./custom-logo-configuration.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomLogoConfigurationComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() logos: Array<Logo>;
  @Input() activeLogoId: string;
  @Input() logosConfig: LogosConfiguration;

  @Output() delete = new EventEmitter<Logo>();
  @Output() defaultLogo = new EventEmitter<string>();
  @Output() notification = new EventEmitter<LaCustomNotificationDefinition>();

  fileUploaderAlert: SimpleAlert;

  fileFormControl: FormControl;

  /**
   * @ignore
   */
  constructor(public dialogService: DialogService,
              private formValidationService: FormValidationService,
              private commonService: CommonService) {
  }

  /**
   * @ignore
   */
  ngOnInit() {
    this.fileFormControl = new FormControl(
      {value: void 0, disabled: false},
      {
        validators: this.formValidationService.requireFileTypes(this.logosConfig.fileTypes),
        asyncValidators: this.formValidationService.asyncImage(this.logosConfig.fileSize, this.logosConfig.ratio)
      }
    );

    this.fileFormControl.valueChanges
      .pipe(
        switchMap(() =>
          // b/c of async validators
          this.fileFormControl.statusChanges.pipe(
            startWith(this.fileFormControl.status),
            filter(status => status !== 'PENDING'),
            take(1)
          )
        ),
      )
      .subscribe(() => {
        if (this.fileFormControl.valid && !this.commonService.isNil(this.fileFormControl.value)) {
          this.openModal(void 0, this.fileFormControl.value.name, this.fileFormControl.value);
        }
      });
  }

  /**
   * Open edit modal for editing
   * @param logo Logo details
   */
  openEditModal(logo: Logo) {
    if (logo === void 0) {
      return;
    }
    this.openModal(logo.id, logo.name, void 0, logo.lastLogoUpdateTime);
  }

  /**
   * Deleting a logo
   * @param logo Logo
   */
  deleteLogo(logo: Logo): void {
    if (logo === void 0) {
      return;
    }
    this.delete.emit(logo);
  }

  /**
   * When default logo changes
   * @param selectedLogo logo of default
   */
  selectLogo(selectedLogo?: Logo): void {
    this.defaultLogo.emit((selectedLogo !== void 0) ? selectedLogo.id : void 0);
  }

  /**
   * Open Logo Management Modal
   * @param id Logo Id (void 0 if new)
   * @param name logo name
   * @param file file of logo
   * @param lastLogoUpdateTime time when logo was updated
   */
  openModal(id: string, name: string, file?: File, lastLogoUpdateTime?: number): void {
    this.dialogService.open(
      LogoManagementModalContainer,
      {
        data: {
          id,
          name,
          file,
          lastLogoUpdateTime,
          logosConfig: this.logosConfig,
          titleText: `${id ? 'EDIT' : 'ADD'} LOGO`
        } as LogoManagementModalDataInterface,
        size: Size.SM
      },
      (notification) => {
        this.fileFormControl.setValue(void 0);
        if (notification !== void 0) {
          this.notification.emit(notification);
        }
      }
    );
  }
}
