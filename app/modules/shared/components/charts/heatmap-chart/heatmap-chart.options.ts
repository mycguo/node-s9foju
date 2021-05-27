import * as Highcharts from 'highcharts';
import { ChartElementColors } from '../../chart-widget/constants/chart-element-colors.enum';

const HeatmapChartOptions: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      spacing: [5, 10, 0, 10],
    },
    title: {
      text: undefined
    },
    exporting: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%b %e',
      },
      minPadding: 0,
      maxPadding: 0,
      lineColor: ChartElementColors.GEYSER_BASE,
      tickColor: ChartElementColors.GEYSER_BASE,
      tickLength: 6,
    },
    yAxis: {
      title: {
        text: undefined
      },
      gridLineWidth: 0,
      lineColor: ChartElementColors.GEYSER_BASE,
      lineWidth: 1,
      tickWidth: 1,
      tickLength: 2,
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 24,
      padding: 0,
      verticalAlign: 'top',
      squareSymbol: false,
      symbolWidth: 20,
      symbolHeight: 7,
      symbolRadius: 3,
      symbolPadding: 4,
      itemDistance: 6,
      itemWidth: 186,
      itemHoverStyle: {
        color: ChartElementColors.OXFORD_BLUE_BASE,
      },
      itemStyle: {
        fontSize: '10px',
        lineHeight: '12px',
        color: ChartElementColors.REGENT_GRAY_BASE,
        fontWeight: 'normal'
      }
    },
    plotOptions: {
      heatmap: {
        borderWidth: 1,
        borderColor: '#fff',
      }
    },
  };

export default HeatmapChartOptions;
