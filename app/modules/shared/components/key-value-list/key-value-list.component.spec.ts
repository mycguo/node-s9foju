import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyValueListComponent } from './key-value-list.component';
import {Component} from "@angular/core";
import {KeyValueListItemDirective} from "./key-value-list-item/key-value-list-item.directive";

@Component({
  template: `
    <nx-key-value-list>
        <div nxKeyValueListItem [key]="'1'" [value]="'text'"></div>
        <div nxKeyValueListItem [key]="'2'" [template]="template">
          <ng-template  #template>
            <div class="template">template</div>
          </ng-template>
        </div>
    </nx-key-value-list>
  `
})
class TestHostComponent {}

describe('KeyValueListComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        KeyValueListComponent,
        KeyValueListItemDirective,
        TestHostComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the row with the default template ', () => {
    let valueEl: HTMLElement = fixture.nativeElement.querySelector('.kvl-table-cell_value');
    expect(valueEl.textContent).toContain('text');
  });

  it('should create the row with the custom template', () => {
    let valueEl: HTMLElement = fixture.nativeElement.querySelector('.template');
    expect(valueEl.textContent).toContain('template');
  });
});
