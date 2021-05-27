import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared.module';
import { DialogService } from './dialog.service';
import { TestBed } from '@angular/core/testing';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule]
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
