import DetailedError from '../../../shared/components/loading/detailed-error';

export interface VisualDataGenerator<B = any, C = any, D = any, T = any, O = any> {
  /**
   * Builds a config from some source data. The buildFrom param could be something
   * like a ReportResponse.
   * Note that the returned object must not be null.
   * @param buildFrom Data to generate the config from.
   */
  buildConfig(buildFrom: B): C;

  transformData(data: D): T;

  setOptions(options: O): void;

  /** Returns an error object if an error can be derived by the data. */
  generateError(data: D): DetailedError;
}
