import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermReportsConfigurationComponent } from './long-term-reports-configuration.component';

describe('LongTermReportsConfigurationComponent', () => {
  let component: LongTermReportsConfigurationComponent;
  let fixture: ComponentFixture<LongTermReportsConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LongTermReportsConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermReportsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
