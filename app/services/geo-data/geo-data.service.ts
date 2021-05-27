import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeoJsonObject} from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class GeoDataService {

  constructor(
    private http: HttpClient
  ) { }

  public getTopoJson(): Observable<GeoJsonObject> {
    return this.http.get<GeoJsonObject>('assets/maps/dashGeo.json');
  }
}
