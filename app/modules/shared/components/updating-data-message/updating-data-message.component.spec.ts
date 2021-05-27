import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatingDataMessageComponent } from './updating-data-message.component';

describe('UpdatingDataMessageComponent', () => {
  let component: UpdatingDataMessageComponent;
  let fixture: ComponentFixture<UpdatingDataMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatingDataMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatingDataMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
