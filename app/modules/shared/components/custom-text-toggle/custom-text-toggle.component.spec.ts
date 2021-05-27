import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTextToggleComponent } from './custom-text-toggle.component';

describe('CustomTextToggleComponent', () => {
  let component: CustomTextToggleComponent;
  let fixture: ComponentFixture<CustomTextToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTextToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTextToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
