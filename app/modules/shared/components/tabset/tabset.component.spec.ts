import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsetComponent } from './tabset.component';

describe('PageTabsComponent', () => {
  let component: TabsetComponent;
  let fixture: ComponentFixture<TabsetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
