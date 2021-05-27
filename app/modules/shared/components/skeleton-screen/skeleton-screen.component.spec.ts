import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonScreenComponent } from './skeleton-screen.component';

describe('SkeletonScreenComponent', () => {
  let component: SkeletonScreenComponent;
  let fixture: ComponentFixture<SkeletonScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkeletonScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
