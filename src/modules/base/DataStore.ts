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

  public set<T>(key: string, Constructor: { new (): T }): DataStore {
    this.map.set(key, new Constructor());
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
