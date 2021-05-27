import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOidPollingPageComponent } from './custom-oid-polling-page.component';

describe('CustomOidPollingPageComponent', () => {
  let component: CustomOidPollingPageComponent;
  let fixture: ComponentFixture<CustomOidPollingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomOidPollingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOidPollingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
