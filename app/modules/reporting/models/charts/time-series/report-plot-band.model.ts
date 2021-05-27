export default interface ReportPlotBand {
  /** The shading color of the plot band */
  color: string;

  /** The start value of the plot band.  This can be relative to an x or y value*/
  start: number;

  /** The end value of the plot band.  This can be relative to an x or y value*/
  end: number;
}
