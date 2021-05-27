import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeDataInfoListComponent } from './node-data-info-list.component';
import { MatListModule } from '@angular/material/list';

describe('NodeDataInfoListComponent', () => {
  let component: NodeDataInfoListComponent;
  let fixture: ComponentFixture<NodeDataInfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule
      ],
      declarations: [
        NodeDataInfoListComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeDataInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
