import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeverityCellRendererComponent } from './severity-cell-renderer.component';

describe('SeverityCellRendererComponent', () => {
  let component: SeverityCellRendererComponent;
  let fixture: ComponentFixture<SeverityCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeverityCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeverityCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
