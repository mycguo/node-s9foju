import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeSnmpImportModalComponent } from './live-insight-edge-snmp-import-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('LiveInsightEdgeSnmpImportModalComponent', () => {
  let component: LiveInsightEdgeSnmpImportModalComponent;
  let fixture: ComponentFixture<LiveInsightEdgeSnmpImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ],
      declarations: [ LiveInsightEdgeSnmpImportModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeSnmpImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
