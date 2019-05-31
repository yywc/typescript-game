/**
 * 变量缓存器，方便我们在不同的类中访问和修改变量
 */

import { DataStoreSet, DataStoreGet } from '@/types/Index';

export default class DataStore {
  private static instance: DataStore;
  private readonly map: Map<string, any> = new Map();
  [key: string]: any;

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  public set(key: string, value: DataStoreSet): DataStore {
    let mapValue: any = value;
    if (typeof value === 'function') {
      mapValue = new value();
    }
    this.map.set(key, mapValue);
    return this;
  }

  public get(key: string): DataStoreGet {
    return this.map.get(key);
  }

  public destroy(): void {
    for (const key of this.map.keys()) {
      this.map.set(key, null);
    }
  }
}
