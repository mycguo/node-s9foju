import { Component, OnInit } from '@angular/core';
import {DevicesService} from '../../../settings/services/devices/devices.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-ipsla-story-container',
  template: `
    <nx-ipsla-story></nx-ipsla-story>
  `,
  styles: [
  ]
})
export class IpslaStoryContainer implements OnInit {

  constructor(private devicesService: DevicesService) { }

  ngOnInit(): void {
    // no error handling needed as default device preference will be used
    // logging done in service
    this.devicesService.getDevicesPreferences()
      .pipe(untilDestroyed(this))
      .subscribe();
  }

}
