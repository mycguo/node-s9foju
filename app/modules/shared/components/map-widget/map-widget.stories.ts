import { moduleMetadata } from '@storybook/angular';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MapWidgetComponent } from './map-widget.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  DivIcon,
  geoJSON,
  Icon,
  LatLng,
  latLng,
  latLngBounds,
  LatLngBounds,
  Map,
  MapOptions,
  Marker,
  MarkerClusterGroupOptions,
  Point,
  tileLayer,
} from 'leaflet';
import { GeoDataService } from '../../../../services/geo-data/geo-data.service';
import { CardComponent } from '../card/card.component';
import { take } from 'rxjs/operators';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

function generateLat() {
  return Math.random() * 360 - 180;
}
function generateLon() {
  return Math.random() * 180 - 90;
}

const markerData = (count) => {
  const data: L.Marker[] = [];

  for (let i = 0; i < count; i++) {
    const icon = new DivIcon({
      html: `<div>Site ${i}</div>`,
      className: 'nx-map-marker-icon',
      iconSize: new Point(16, 16),
    });

    data.push(
      new Marker([generateLon(), generateLat()], {
        icon: icon,
        title: `Site ${i}`,
      })
    );
  }

  return data;
};

@Component({
  selector: 'nx-map-widget-stories',
  template: `
    <nx-card [lightweight]="true" [header]="custom" [body]="body">
      <ng-template #custom>
        <p
          class="nx-lightweight-card__header-title nx-lightweight-card-header-title"
        >
          Site Insights Map
        </p>
        <p
          class="nx-lightweight-card__header-notation nx-lightweight-card-header-notation"
        >
          Last 30 days
        </p>
      </ng-template>
      <ng-template #body>
        <nx-map-widget
          class="map-container"
          [mapOptions]="options"
          [markerClusterData]="markerClusterData"
          [markerClusterOptions]="markerOptions"
          (mapInstance)="mapInstance($event)"
        >
        </nx-map-widget>
      </ng-template>
    </nx-card>
  `,
  styleUrls: ['./map-widget-stories.less'],
})
class MapWidgetStories implements OnInit {
  @Input() baseType;
  @Input() markerClusterData;

  options: MapOptions;
  map: Map;
  markerOptions: MarkerClusterGroupOptions;

  constructor(private geoDataService: GeoDataService) {
    this.markerOptions = {
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const childCount = cluster.getChildCount();
        return new DivIcon({
          html: `<div>${childCount}</div>`,
          className: 'nx-map-cluster-icon',
          iconSize: new Point(16, 16),
        });
      },
    };
  }

  ngOnInit() {
    const southWest: LatLng = latLng(-60, -240);
    const northEast: LatLng = latLng(90, 240);
    const bounds: LatLngBounds = latLngBounds(southWest, northEast);

    if (this.baseType === 'osm') {
      // add OSM layer or can be added later on mapInstance similar to GeoJson
      this.options = {
        maxBounds: bounds,
        layers: [
          tileLayer(
            'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
              subdomains: 'abcd',
              detectRetina: true,
              minZoom: 1,
              maxZoom: 17,
              noWrap: false,
            }
          ),
        ],
      };
    } else {
      this.options = {
        maxBounds: bounds,
      };
    }
  }

  mapInstance(map: Map) {
    this.map = map;
    if (this.baseType === 'json') {
      this.initLayer();
    }
  }

  initLayer() {
    this.geoDataService
      .getTopoJson()
      .pipe(take(1))
      .subscribe((geoJson) => {
        // add GeoJSON layer
        geoJSON(geoJson, {
          style: {
            stroke: false,
            fill: true,
            fillColor: '#fff',
            fillOpacity: 1,
            interactive: false,
          },
        }).addTo(this.map);
      });
  }
}

export default {
  title: 'Shared/Map Widget',

  decorators: [
    moduleMetadata({
      imports: [LeafletModule, LeafletMarkerClusterModule, HttpClientModule],
      declarations: [MapWidgetComponent, CardComponent],
      providers: [GeoDataService],
    }),
  ],
};

export const GeoJsonBase = () => ({
  props: {
    baseType: 'json',
    markerClusterData: markerData(100),
  },
  component: MapWidgetStories,
});

GeoJsonBase.story = {
  name: 'GeoJSON base',
};

export const OsmBase = () => ({
  props: {
    baseType: 'osm',
    markerClusterData: markerData(100),
  },
  component: MapWidgetStories,
});

OsmBase.story = {
  name: 'OSM base',
};
