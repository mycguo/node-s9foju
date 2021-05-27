import {Injectable, OnDestroy} from '@angular/core';
import {noop, Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LicenseQuery} from '../../store/license/license.query';
import {LicenseStore} from '../../store/license/license.store';
import {StoreAdapterFactoryService} from '../store-adapter-factory/store-adapter-factory.service';
import UxLicense from './uxLicense.model';
import NxLicense from './nxLicense.model';
import LicenseVersion from './licenseVersion.model';
import CleanInstallationStatus from './cleanInstallationStatus.model';
import {Logger} from '../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class LicenseService implements OnDestroy {

  readonly nxVersion = '/api/nx/version';
  readonly licenseUrl = '/api/license';
  readonly uxLicenseUrl = `${this.licenseUrl}/liveux`;
  readonly nxLicenseUrl = `${this.licenseUrl}/liveaction`;
  readonly nxLicenseCleanUrl = `${this.licenseUrl}/liveaction/clean`;
  readonly nxLicenseModelUrl = `${this.licenseUrl}/liveaction/mode`;

  private uxLicenseSub: Subscription;
  private nxLicenseSub: Subscription;
  private versionSub: Subscription;
  private cleanInstallationStatusSub: Subscription;

  constructor(
    private http: HttpClient,
    private licenseQuery: LicenseQuery,
    private logger: Logger,
    private licenseStore: LicenseStore,
    private storeAdapterFactory: StoreAdapterFactoryService
  ) { }

  getNxLicenseInfo(): Observable<NxLicense> {
    if (this.licenseQuery.getValue().nxLicense === null && this.nxLicenseSub === void 0) {
      this.nxLicenseSub = this.storeAdapterFactory.createStoreSubscription<NxLicense>(
        this.nxLicenseUrl,
        (resp) => { this.licenseStore.setNxLicenseState(resp); }
      ).subscribe();
    }
    return this.licenseQuery.select(licenseState => licenseState.nxLicense);
  }

  getUxLicenseInfo(): Observable<UxLicense> {
    if (this.licenseQuery.getValue().uxLicense === null && this.uxLicenseSub === void 0) {
      this.uxLicenseSub = this.storeAdapterFactory.createStoreSubscription<UxLicense>(
        this.uxLicenseUrl,
        (resp) => { this.licenseStore.setUxLicenseState(resp); }
      ).subscribe();
    }
    return this.licenseQuery.select( licenseState => licenseState.uxLicense);
  }

  getVersionInfo(): Observable<LicenseVersion> {
    if (this.licenseQuery.getValue().version === null && this.versionSub === void 0) {
      this.versionSub = this.storeAdapterFactory.createStoreSubscription<LicenseVersion>(
        this.nxVersion,
        (resp) => { this.licenseStore.setVersionState(resp); }
      ).subscribe();
    }
    return this.licenseQuery.select(licenseState => licenseState.version );
  }

  getCleanInstallationStatus(): Observable<CleanInstallationStatus> {
    if (this.licenseQuery.getValue().cleanInstallationStatus === null && this.cleanInstallationStatusSub === void 0) {
      this.cleanInstallationStatusSub = this.storeAdapterFactory.createStoreSubscription<CleanInstallationStatus>(
        this.nxLicenseCleanUrl,
        (resp) => { this.licenseStore.setCleanInstallationStatus(resp); }
      ).subscribe();
    }
    return this.licenseQuery.select(licenseState => licenseState.cleanInstallationStatus);
  }

  setLicenseMode(mode: any): Observable<any> {
    return this.http.post(this.nxLicenseModelUrl, mode);
  }

  ngOnDestroy(): void {
    this.uxLicenseSub ? this.uxLicenseSub.unsubscribe() : noop();
    this.nxLicenseSub ? this.nxLicenseSub.unsubscribe() : noop();
    this.versionSub ? this.versionSub.unsubscribe() : noop();
    this.cleanInstallationStatusSub ? this.cleanInstallationStatusSub.unsubscribe() : noop();
  }
}
