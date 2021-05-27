import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter, HostBinding,
  HostListener,
  Input, OnChanges,
  Output, SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonService} from '../../../../utils/common/common.service';
import {ComponentFactoryHelper} from '../../../../utils/component-factory-helper/component-factory-helper';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { MatSidenav } from '@angular/material/sidenav';

const SIDEBAR_WIDTH_DEFAULT = '480px';

@UntilDestroy()
@Component({
  selector: 'nx-sidebar-display',
  templateUrl: './sidebar-display.component.html',
  styleUrls: ['./sidebar-display.component.less'],
  host: {
    '[class.nx-sidebar]': 'true'
  }
})
export class SidebarDisplayComponent implements OnChanges, AfterViewInit {
  @Input() titleText: string;
  @Input() componentHelper: ComponentFactoryHelper;
  @Input() header: TemplateRef<any>;
  @Input() footer: TemplateRef<any>;
  @Input() width: string;

  // Elements which should prevent the closing sidebar
  @Input() closePreventClassList: string[];

  // Whether the drawer can be closed by clicking outside the wrapper or specific elements.
  @Input() closeOnClickOutside = false;

  // Reference on the material drawer which wraps the host element
  @Input() drawerRef: MatSidenav;

  @Output() close = new EventEmitter();

  @ViewChild('body', {read: ViewContainerRef}) body: ViewContainerRef;

  @HostBinding('style.width') get getWidth() { return this.width || SIDEBAR_WIDTH_DEFAULT; }
  @HostListener('document:click', ['$event.target']) private onClickOutside(targetEl: HTMLElement): void {

    // Do not check the target element of the click if the material drawer is not defined or closed
    if (!this.closeOnClickOutside || !this.drawerRef || !this.drawerRef.opened) {
      return;
    }

    // Check the custom elements which should prevent the closing sidebar
    const closePreventClassList = [...this.closePreventClassList || [], 'nx-sidebar'];

    // Check if the click on the current element should not close sidebar
    const isTarget = !!closePreventClassList.find(classListItem => targetEl.classList.contains(classListItem));

    // Check if the click on the current element's children should not close sidebar
    const isParentTarget = !!closePreventClassList.find(classListItem => targetEl.closest(`.${classListItem}`));

    if (!isTarget && !isParentTarget) {

      // Check if the click target is not "appendToBody" element, such as Angular Drop Down, Pop Up, etc.
      // Other elements are placed into <div class="la-app"/> container
      if (!!targetEl.closest('.la-app')) {
        this.closeSidebar();
      }
    }
  }

  constructor(private commonService: CommonService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.componentHelper?.currentValue) && !this.commonService.isNil(this.body)) {
      const componentHelper: ComponentFactoryHelper = changes.componentHelper.currentValue;
      this.setComponent(componentHelper);
    }
  }

  ngAfterViewInit(): void {
    if (!this.commonService.isNil(this.componentHelper)) {
      this.setComponent(this.componentHelper);
    }
  }

  setComponent(componentHelper: ComponentFactoryHelper): void {
    this.body.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentHelper.component);
    const componentRef = this.body.createComponent(componentFactory);
    Object.keys(componentHelper.params).forEach((param: string) => {
      componentRef.instance[param] = componentHelper.params[param];
    });
    // set component outputs
    const keys: Array<string> = componentHelper.getOutputKeys();
    keys.forEach((key: string) => {
      componentRef.instance[key]
        .pipe(untilDestroyed(this))
        .subscribe((value: any) => {
          componentHelper.emitOutput(key, value);
        });
    });

  }

  closeSidebar() {
    this.close.emit();
  }
}
