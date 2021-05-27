import {
  Component,
  ComponentFactoryResolver,
  Inject,
  Injector,
  Input, OnChanges,
  OnInit,
  Optional, SimpleChanges,
  SkipSelf,
  Type
} from '@angular/core';
import WidgetDataProvider from './widget-data-provider';
import {WidgetVisualComponent} from './widget-visual.component';
import {Observable} from 'rxjs';
import {VisualDataGenerator} from './visual-data-generator';
import {tap} from 'rxjs/operators';
import {CommonService} from '../../../../utils/common/common.service';
import {FlexFilterProvider, FlexFilterProviderToken} from '../../../../services/page-filter/flex-filter-provider.model';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {Logger} from '../../../logger/logger';

@Component({
  selector: 'nx-dashboard-widget-container',
  template: `
    <nx-dashboard-widget
      [data]="data$ | async"
      [config]="config$ | async"
      [component]="visualComponent"
      [headerTitle]="headerTitle"
      [headerSubtitle]="headerSubtitle"
      [dateRange]="dateRange"
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [hideCard]="hideCard"
      [showContent]="showContent"
    ></nx-dashboard-widget>
  `,
  styleUrls: ['./dashboard-widget.container.less']
})
export class DashboardWidgetContainer implements OnInit, OnChanges {

  @Input() widgetId: string;
  @Input() dataKey: string;
  // ? Config with visual display component
  @Input() visualComponent: Type<WidgetVisualComponent<any, any>>;
  @Input() visualDataGenerator: Type<VisualDataGenerator>;
  @Input() visualDataGeneratorOptions: any;
  @Input() headerTitle: string;
  @Input() headerSubtitle: string;
  @Input() dateRange: string;
  @Input() hideCard = false;

  data$: Observable<any>;
  config$: Observable<any>;
  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  showContent: boolean;
  dataGenerator: VisualDataGenerator;

  constructor(@SkipSelf() @Optional() private dataProvider: WidgetDataProvider,
              private commonService: CommonService,
              @SkipSelf() @Optional() @Inject(FlexFilterProviderToken) private flexFilterProvider: FlexFilterProvider,
              private logger: Logger,
              private resolver: ComponentFactoryResolver,
              private injector: Injector) { }

  ngOnInit(): void {
    if (this.dataProvider == null) {
      // log error; send error to child component
      this.logger.error('No data provider provided for widget');
    } else {
      // listen for data given the widget id
      try {
        if (this.visualDataGenerator != null) {
          const visualDataInjector = Injector.create({
            providers: [
              { provide: FlexFilterProviderToken, useValue: this.flexFilterProvider},
            ],
            parent: this.injector,
            name: 'dashboard-widget-injector'
          });
          this.dataGenerator = visualDataInjector.get<VisualDataGenerator>(this.visualDataGenerator);
        } else {
          const componentFactory = this.resolver.resolveComponentFactory(this.visualComponent);
          const componentRef = componentFactory.create(this.injector);
          this.dataGenerator = componentRef.instance.dataGenerator;
        }
        if (this.visualDataGeneratorOptions != null) {
          this.dataGenerator.setOptions(this.visualDataGeneratorOptions);
        }
        this.config$ = this.dataProvider.getVisualConfig(this.dataKey, this.dataGenerator).pipe(
          tap((data: any) => {
            // show content once config is setup
            this.showContent = true;
          })
        );
        this.data$ = this.dataProvider.getData(this.dataKey, this.dataGenerator);
        this.isLoading$ = this.dataProvider.getIsLoading(this.dataKey);
        this.error$ = this.dataProvider.getError(this.dataKey, this.dataGenerator);
        // map data to update for metadata
      } catch (e) {
        this.logger.warn(`Error configuring widget component. ${e}`);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.visualDataGeneratorOptions?.currentValue != null && this.dataGenerator != null) {
      this.dataGenerator.setOptions(this.visualDataGeneratorOptions);
      this.config$ = this.dataProvider.getVisualConfig(this.dataKey, this.dataGenerator);
      this.data$ = this.dataProvider.getData(this.dataKey, this.dataGenerator);
    }
  }

}
