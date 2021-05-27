import {LatLngExpression, Marker, MarkerOptions} from 'leaflet';


export class MapMarker<T = any> extends Marker {
  _data: any;

  constructor(latLng: LatLngExpression, options?: MarkerOptions, data?: T) {
    super(latLng, options);
    this.setData(data);
  }

  getData() {
    return this._data;
  }

  setData(data: any) {
    this._data = data;
  }
}
