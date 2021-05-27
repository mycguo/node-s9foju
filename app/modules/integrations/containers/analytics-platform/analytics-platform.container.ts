import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsPlatformService} from '../../../../services/analytics-platform/analytics-platform.service';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import AnalyticsPlatformModel from '../../components/analytics-platform/analytics-platform.model';
import AnalyticsPlatformConfig from '../../../../services/analytics-platform/config/analytics-platform-config';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-analytics-platform-container',
  template: `
    <nx-analytics-platform
            [state]="viewState"
            [data]="data"
            [configErrors]="analyticsPlatformService.errors$() | async"
            [connectionErrors]="analyticsPlatformService.statusErrors$() | async"
            [isLoading]="analyticsPlatformService.loadingState$() | async"
            [isCheckingConnection]="analyticsPlatformService.checkingConnection$() | async"
            (edit)="editHandler()"
            (delete)="deleteHandler()"
            (submitForm)="submitFormHandler($event)"
            (cancel)="cancelHandler()"
            (checkConnection)="checkConnectionHandler()"
    ></nx-analytics-platform>
  `,
  styleUrls: ['./analytics-platform.container.less']
})
export class AnalyticsPlatformContainer implements OnInit, OnDestroy {


  viewState: IntegrationDisplayStateEnum = IntegrationDisplayStateEnum.VIEW;
  data: AnalyticsPlatformModel = new AnalyticsPlatformModel();

  constructor(
    public analyticsPlatformService: AnalyticsPlatformService,
  ) { }

  ngOnInit() {
    this.analyticsPlatformService.configState$()
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.data = <AnalyticsPlatformModel> Object.assign({}, this.data, {
          hostname: state.config.hostname,
          port: state.config.port,
        });
        // if currently in a edit view state set as read view state
        if (state.error === void 0 && state.loading === false) {
          this.viewState = this.data.hostname !== void 0 && this.data.port !== void 0 ?
            IntegrationDisplayStateEnum.VIEW :
            IntegrationDisplayStateEnum.EDIT;
        }
    });
    this.analyticsPlatformService.statusState$()
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.data = <AnalyticsPlatformModel> Object.assign({}, this.data, {
          status: state
        });
      });


    this.analyticsPlatformService.fetchConfig();
    this.analyticsPlatformService.checkConnection();
  }

  ngOnDestroy(): void {
  }

  editHandler() {
    this.viewState = IntegrationDisplayStateEnum.EDIT;
  }

  deleteHandler() {
    this.analyticsPlatformService.resetErrors();
    this.analyticsPlatformService.openDeleteConfigDialog();
  }

  submitFormHandler(form: AnalyticsPlatformModel) {
    this.analyticsPlatformService.resetErrors();
    const config = new AnalyticsPlatformConfig();
    config.hostname = form.hostname;
    config.port = form.port;
    this.analyticsPlatformService.setConfig(config);
  }

  cancelHandler() {
    this.analyticsPlatformService.resetErrors();
    this.viewState = IntegrationDisplayStateEnum.VIEW;
  }

  checkConnectionHandler() {
    this.analyticsPlatformService.checkConnection();
  }

}
