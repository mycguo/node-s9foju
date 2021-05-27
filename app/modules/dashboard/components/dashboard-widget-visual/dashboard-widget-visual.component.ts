import {
  Component,
  ComponentFactoryResolver, ComponentRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type, ViewChild
} from '@angular/core';
import { WidgetVisualComponent } from '../../containers/dashboard-widget/widget-visual.component';
import { WidgetVisualDirective } from '../../directives/widget-visual.directive';
import {Logger} from '../../../logger/logger';

@Component({
  selector: 'nx-dashboard-widget-visual',
  templateUrl: './dashboard-widget-visual.component.html',
  styleUrls: ['./dashboard-widget-visual.component.less']
})
export class DashboardWidgetVisualComponent implements OnInit, OnChanges, OnDestroy {
  @Input() component: Type<WidgetVisualComponent<any, any>>;
  @Input() data: any;
  @Input() config: any;

  @ViewChild(WidgetVisualDirective, {static: true}) widgetVisualContainer: WidgetVisualDirective;
  componentRef: ComponentRef<WidgetVisualComponent<any, any>>;

  componentHasLoaded = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private logger: Logger,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.componentHasLoaded) {
      this.initComponent();
    }
    if ((changes.data || changes.config) && (this.data != null && this.config != null)) {
      this.componentRef.instance.config = this.config;
      this.componentRef.instance.data = this.data;
    }
  }

  private initComponent(): void {
    this.widgetVisualContainer.viewContainerRef.clear();
    try {
      const visualFactory = this.resolver.resolveComponentFactory(this.component);
      this.componentRef = this.widgetVisualContainer.viewContainerRef.createComponent(visualFactory);
      // pass config to correctly init component
      this.componentRef.instance.config = this.config;
      this.componentHasLoaded = true;
    } catch (err) {
      this.logger.error(`dashboard-widget-visual.component ${err}`);
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
