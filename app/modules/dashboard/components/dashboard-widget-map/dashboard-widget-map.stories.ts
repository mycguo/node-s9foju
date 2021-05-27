import { moduleMetadata } from '@storybook/angular';
import { DashboardWidgetMapComponent } from './dashboard-widget-map.component';
import { GeoDataService } from '../../../../services/geo-data/geo-data.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapWidgetComponent } from '../../../shared/components/map-widget/map-widget.component';
import { HttpClientModule } from '@angular/common/http';
import { DivIcon, Point } from 'leaflet';
import { Icon } from 'leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { SiteProperties } from './model/site-properties';
import { MapMarker } from './model/map-marker';

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
      new MapMarker<SiteProperties>(
        [generateLon(), generateLat()],
        { icon: icon, title: `Site ${i}` },
        {
          id: 'siteId',
          name: `Site ${i}`,
          status: `siteStatus ${i}`,
        }
      )
    );
  }

  return data;
};

export default {
  title: 'Dashboard/DashboardWidgetMapComponent',

  decorators: [
    moduleMetadata({
      imports: [LeafletModule, LeafletMarkerClusterModule, HttpClientModule],
      declarations: [MapWidgetComponent, DashboardWidgetMapComponent],
      providers: [GeoDataService],
    }),
  ],
};

export const OsmMap = () => ({
  props: {
    data: markerData(1000),
  },
  template: `<nx-dashboard-widget-map [data]="data" style="display: block; width: 400px; height: 333px;"></nx-dashboard-widget-map>`,
});

OsmMap.story = {
  name: 'OSM map',
};

export const OfflineMap = () => ({
  props: {
    data: markerData(1000),
    isOnline: false,
  },
  template: `<nx-dashboard-widget-map [data]="data" [isOnline]="isOnline" style="display: block; width: 400px; height: 333px;"></nx-dashboard-widget-map>`,
});

OfflineMap.story = {
  name: 'Offline map',
};
