import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import UxLicense from '../../services/license/uxLicense.model';
import NxLicense from '../../services/license/nxLicense.model';
import LicenseVersion from '../../services/license/licenseVersion.model';
import CleanInstallationStatus from '../../services/license/cleanInstallationStatus.model';

export interface LicenseState {
  uxLicense: UxLicense;
  nxLicense: NxLicense;
  version: LicenseVersion;
  cleanInstallationStatus: CleanInstallationStatus;
}

function createInitialState(): LicenseState {
  return {
    uxLicense: null,
    nxLicense: null,
    version: null,
    cleanInstallationStatus: null,
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'license' })
export class LicenseStore extends Store<LicenseState> {
  constructor() {
    super(createInitialState());
  }

  setUxLicenseState(uxLicense: UxLicense) {
    this.update({ uxLicense });
  }

  setNxLicenseState(nxLicense: NxLicense) {
    this.update({ nxLicense });
  }

  setVersionState(version: LicenseVersion) {
    this.update({ version });
  }

  setCleanInstallationStatus(cleanInstallationStatus: CleanInstallationStatus) {
    this.update({ cleanInstallationStatus });
  }
}
