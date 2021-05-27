import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges, OnInit,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {CommonService} from '../../../../utils/common/common.service';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {DisplayError} from './enums/display-error.enum';
import {LoadingState} from './enums/loading-state.enum';
import SimpleAlert from '../simple-alert/model/simple-alert';
import {SIMPLE_ALERT_TYPE_ENUM} from '../simple-alert/model/simple-alert-type.enum';
import DetailedError from './detailed-error';

@Component({
  selector: 'nx-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less']
})
export class LoadingComponent implements OnInit, OnChanges {
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() displayError = DisplayError.FATAL;
  @Input() showContent = false;
  @Input() fatalMessageOverride: LaNoDataMessage;
  @Input() alertMessageOverride: SimpleAlert;
  // template inputs
  @Input() contentTemplate: TemplateRef<any>;
  @Input() loadingTemplate: TemplateRef<any>;
  @Input() updatingTemplate: TemplateRef<any>;
  @Input() errorTemplate: TemplateRef<any>;

  state: LoadingState;
  fatalErrorMessage: LaNoDataMessage;
  alertErrorMessage: SimpleAlert;

  states = LoadingState;
  displayErrors = DisplayError;

  constructor(private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.updateComponentState(
      this.isLoading,
      this.error,
      this.showContent
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateComponentState(this.isLoading,
      this.error,
      this.showContent
    );
  }

  /**
   * Set class properties based on state
   * @param isLoading - if we are loading data
   * @param error - if there is an error
   * @param showContent - if content should be shown
   */
  private updateComponentState(isLoading: boolean,
                               error: DetailedError,
                               showContent: boolean): void {
    this.fatalErrorMessage = void 0;
    this.alertErrorMessage = void 0;

    this.state = this.getLoadingState(isLoading, error, showContent);
    switch (this.state) {
      case LoadingState.ERROR:
        this.fatalErrorMessage = this.createFatalErrorMessage(error);
        break;
      case LoadingState.ALERT:
        this.alertErrorMessage = this.createAlertMessage(error);
        break;
      default:
        break;
    }
  }

  /**
   * Determine which state we are in
   * @param isLoading - if we are loading data
   * @param error - if there is an error
   * @param showContent - if content should be shown
   */
  getLoadingState(isLoading: boolean,
                  error: Error,
                  showContent: boolean): LoadingState {
    if (this.isLoading) {
      if (showContent) {
        return LoadingState.UPDATING;
      } else {
        return LoadingState.LOADING;
      }
    } else {
      if (!this.commonService.isNil(error)) {
        if (this.displayError === DisplayError.FATAL) {
          return LoadingState.ERROR;
        } else {
          return LoadingState.ALERT;
        }
      } else {
        return LoadingState.NONE;
      }
    }
  }

  /**
   * Build fatal error message
   * @param error Error object
   */
  createFatalErrorMessage(error: DetailedError): LaNoDataMessage {
    return new LaNoDataMessage(
      this.fatalMessageOverride?.title ?? error?.title ??  'An Error Occurred',
      this.fatalMessageOverride?.instruction || error?.message,
      this.fatalMessageOverride?.icon,
      this.fatalMessageOverride?.buttons
    );
  }

  createAlertMessage(error: Error): SimpleAlert {
    return new SimpleAlert(this.alertMessageOverride?.title ?? 'An Error Occurred',
      this.alertErrorMessage?.message || error?.message,
      this.alertErrorMessage?.type || SIMPLE_ALERT_TYPE_ENUM.ERROR,
      this.alertErrorMessage?.closeTimeout || -1);
  }

}
