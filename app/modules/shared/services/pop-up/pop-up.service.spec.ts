import { TestBed } from '@angular/core/testing';

import { PopUpService } from './pop-up.service';
import { Overlay } from '@angular/cdk/overlay';
import { Injector } from '@angular/core';

describe('PopUpService', () => {
  let service: PopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Overlay,
          useValue: {}
        },
        {
          provide: Injector,
          useValue: {}
        }
      ]
    });
    service = TestBed.inject(PopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
