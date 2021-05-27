import {WidgetVisualComponent} from '../../containers/dashboard-widget/widget-visual.component';
import {Type} from '@angular/core';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';

/***
 * Describes the fields to support a DashboardWidgetContainer.
 */
export interface DashboardWidgetConfig {
  /**
   * This provides a reference to widget component.
   */
  id: string;
  /**
   * This provides a reference to the request and result data. This is used as a
   * store id reference.
   */
  dataKey: string;
  /**
   * Shown as the main widget title.
   */
  headerTitle: string;
  /**
   * Subtitle shown.
   */
  headerSubtitle: string;
  /**
   * Time range shown.
   */
  timeLabel: string;
  /**
   * The Component type to be used for displaying the data.
   */
  visualComponent: Type<WidgetVisualComponent<any, any>>;
  /**
   * Service which takes the result data to create the view models needed by the
   * specified visualComponent.
   */
  visualDataGenerator: Type<VisualDataGenerator>;
  /**
   * Options which can be used the VisualDataGenerator.s
   */
  visualGeneratorOptions?: any;
  /**
   * True shows the widget without Card Component container.
   */
  hideCard?: boolean;
}
