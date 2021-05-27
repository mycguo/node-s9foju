import {Component, Input, OnInit} from '@angular/core';
import {
  geoJSON,
  latLng,
  LatLng,
  latLngBounds,
  LatLngBounds,
  LeafletEvent,
  Map,
  MapOptions,
  tileLayer,
  MarkerClusterGroupOptions,
  MarkerClusterGroup, DivIcon, Point, Marker
} from 'leaflet';
import {take} from 'rxjs/operators';
import {GeoDataService} from '../../../../services/geo-data/geo-data.service';
import {WidgetVisualComponent} from '../../containers/dashboard-widget/widget-visual.component';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';
import {MapMarker} from './model/map-marker';
import {SiteProperties} from './model/site-properties';

@Component({
  selector: 'nx-dashboard-widget-map',
  templateUrl: './dashboard-widget-map.component.html',
  styleUrls: ['./dashboard-widget-map.component.less']
})
export class DashboardWidgetMapComponent implements OnInit,
  WidgetVisualComponent<any, any> {

  @Input() data: MapMarker<SiteProperties>[];

  // for testing only
  @Input() isOnline = true;

  config: any;
  dataGenerator: VisualDataGenerator;

  map: Map;
  options: MapOptions;
  markerOptions: MarkerClusterGroupOptions;

  constructor(
    private geoDataService: GeoDataService
  ) {
    this.markerOptions = {
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const childCount = cluster.getChildCount();
        return new DivIcon({
          html: `<div>${childCount}</div>`,
          className: 'nx-map-cluster-icon',
          iconSize: new Point(16, 16)
        });
      }
    };
  }


  ngOnInit(): void {
    // set default map bounds larger then max longitude to allow scroll map horizontally
    // cut latitude lower then -60º (Antarctica)
    const southWest: LatLng = latLng(-60, -240);
    const northEast: LatLng = latLng(90, 240);
    const bounds: LatLngBounds = latLngBounds(southWest, northEast);
    this.options = {
      maxBounds: bounds,
      maxZoom: 17
    };
  }

  mapInstance(map: Map) {
    this.map = map;
    this.initBaseLayer();
  }

  private initBaseLayer(): void {
    // Possibly implement online checking service. LD-27167
    if (this.isOnline) {
      tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
          subdomains: 'abcd',
          detectRetina: true,
          minZoom: 1,
          maxZoom: 17,
          noWrap: false
        }
      ).addTo(this.map);
    } else {
      this.geoDataService.getTopoJson()
        .pipe(
          take(1)
        )
        .subscribe(geoJson => {

          // add GeoJSON layer
          geoJSON(geoJson, {
            style: {
              stroke: false,
              fill: true,
              fillColor: '#fff',
              fillOpacity: 1,
              interactive: false
            }
          }).addTo(this.map);
        });
    }
  }

}
