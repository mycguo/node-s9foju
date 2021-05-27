/**
 * Interface to support the visual element of a dashboard widget.
 * T the type of the data.
 * C The type of the config.
 */
import {VisualDataGenerator} from './visual-data-generator';

export interface WidgetVisualComponent<T, C> {
  data: T;
  config: C;

  dataGenerator: VisualDataGenerator;
}
