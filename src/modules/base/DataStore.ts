import { DataStoreGet, DataStoreSet } from '@/types/Index';

export default class DataStore {
  private static instance: DataStore;
  private readonly map: Map<string, any> = new Map();
  [key: string]: any; // 通过外部挂载的数据

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  public set(key: string, value: DataStoreSet): DataStore {
    let mapValue: any = value;
    // 如果是构造函数，则构造对象，否则直接设置到 map
    if (typeof value === 'function') {
      mapValue = new value();
    }
    this.map.set(key, mapValue);
    return this;
  }

  public get(key: string): DataStoreGet {
    return this.map.get(key);
  }
}
