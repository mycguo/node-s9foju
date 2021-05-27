import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpslaStoryTabComponent } from './ipsla-story-tab.component';

describe('IpslaStoryTabComponent', () => {
  let component: IpslaStoryTabComponent;
  let fixture: ComponentFixture<IpslaStoryTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IpslaStoryTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpslaStoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
