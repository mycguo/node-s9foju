import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCellRendererComponent } from './error-cell-renderer.component';
import {SharedModule} from '../../../../shared/shared.module';

describe('ErrorCellRendererComponent', () => {
  let component: ErrorCellRendererComponent;
  let fixture: ComponentFixture<ErrorCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [ ErrorCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
