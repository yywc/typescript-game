import DataStore from './base/DataStore';

export default class Director {
  private static instance: Director;
  private dataStore: DataStore = DataStore.getInstance();

  public static getInstance(): Director {
    if (!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  /**
   * run 控制游戏开始
   */
  public run(): void {
    this.dataStore.get('background').draw();
    console.log('游戏开始');
  }
}
