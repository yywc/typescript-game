/**
 * 变量缓存器，方便我们在不同的类中访问和修改变量
 */

class DataStoreConfig {
  public canvas?: HTMLCanvasElement;
  public ctx?: CanvasRenderingContext2D;
  public res?: Map<string, HTMLImageElement>;
}

export default class DataStore extends DataStoreConfig {
  private static _instance: DataStore;
  public map: Map<string, any>;

  public static getInstance(): DataStore {
    if (!DataStore._instance) {
      DataStore._instance = new DataStore();
    }
    return DataStore._instance;
  }

  private constructor() {
    super();
    this.map = new Map();
  }

  public put(key: string, value: any): DataStore {
    let mapValue = value;
    if (typeof value === 'function') {
      // eslint-disable-next-line new-cap
      mapValue = new value();
    }
    this.map.set(key, mapValue);
    return this;
  }

  public get(key: string): any {
    return this.map.get(key);
  }

  public destroy(): void {
    for (let value of this.map) {
      value = null;
    }
  }
}
