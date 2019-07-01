/**
 * 变量缓存器，方便我们在不同的类中访问和修改变量
 */

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

  public set<T>(key: string, value: { new (): T }): DataStore {
    this.map.set(key, new value());
    return this;
  }

  public get<T>(key: string): T {
    return this.map.get(key);
  }

  public destroy(): void {
    for (const key of this.map.keys()) {
      this.map.set(key, null);
    }
  }
}
