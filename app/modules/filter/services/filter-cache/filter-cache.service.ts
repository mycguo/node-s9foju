import { Injectable } from '@angular/core';
import { FilterColumnValues } from '../../interfaces/filter-column-values';

interface FilterCacheEntry {
  key: string;
  values: FilterColumnValues[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterCacheService {

  private static CACHE_LIMIT = 10;
  private _cache: Array<FilterCacheEntry>;

  constructor() { }

  public clearCache(): void {
    this._cache = [];
  }

  public putToCache(key: string, values: FilterColumnValues[], searchString: string): void {
    if (key !== null) {
      const id = this.createCacheRecordId(key, searchString);
      // check if key already added
      if (this._cache.length > 0 && this.getCacheEntryIndex(id) !== -1) {
        return;
      }
      if (this._cache.length >= FilterCacheService.CACHE_LIMIT) {
        this._cache.shift();
      }
      this._cache.push({key: id, values: values});
    }
  }

  public getFromCache(key: string, searchString: string): FilterColumnValues[] {
    const id = this.createCacheRecordId(key, searchString);
    const index = this.getCacheEntryIndex(id);
    if (index !== -1) {
      // put found record to the end of cache array
      const cacheItem = this._cache.splice(index, 1);
      this._cache.push(cacheItem[0]);
      return cacheItem[0].values;
    }
    return void 0;
  }

  /**
   * Create a cache record ID based on search params
   */
  private createCacheRecordId(key: string, searchString: string): string {
    return `K${key}S${searchString ?? ''}`;
  }

  private getCacheEntryIndex(id: string): number {
    return this._cache.findIndex(entry => entry.key === id);
  }
}
