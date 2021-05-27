import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAccordionSelectComponent } from './report-accordion-select.component';

describe('ReportAccordionSelectComponent', () => {
  let component: ReportAccordionSelectComponent;
  let fixture: ComponentFixture<ReportAccordionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAccordionSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccordionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
