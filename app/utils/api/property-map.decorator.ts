import 'reflect-metadata';

export function PropertyMap(sourceProperty: string) {
  return (target, propertyName) => {
    // can't set property key same as property name
    Reflect.defineMetadata('property-map', sourceProperty, target, PropertyMapHash(propertyName));
  };
}

export function PropertyMapHash(propName: string) {
  return `_${propName}`;
}

