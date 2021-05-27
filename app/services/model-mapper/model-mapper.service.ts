import { Injectable } from '@angular/core';
import 'reflect-metadata';
import {PropertyMapHash} from '../../utils/api/property-map.decorator';

type Constructor<T = any> = new(...args: any[]) => T;

@Injectable({
  providedIn: 'root'
})
export class ModelMapperService {

  constructor() { }

  map<T>(targetType: Constructor<T>, source) {
    const target = new targetType();
    // const modelPropertyMapping = Reflect.getMetadata(Symbol('property-map'), target);
    Object.keys(target).forEach((key) => {
      const reflectFieldKey = PropertyMapHash(key);
      const propertyMapMeta = Reflect.getMetadata('property-map', target, reflectFieldKey);
      target[key] = propertyMapMeta !== void 0 ? source[propertyMapMeta] : source[key];
    });
    return target;
  }
}
