import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpslaStoryComponent } from './ipsla-story.component';

describe('IpslaStoryComponent', () => {
  let component: IpslaStoryComponent;
  let fixture: ComponentFixture<IpslaStoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IpslaStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpslaStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
