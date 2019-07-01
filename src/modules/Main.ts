import ResourceLoader from './base/ResourceLoader';
import DataStore from './base/DataStore';
import Director from './Director';
import Background from './runtime/Background';
import Land from './runtime/Land';
import Birds from '@/modules/player/Birds';
import StartButton from '@/modules/player/StartButton';
import Score from '@/modules/player/Score';

/**
 * Main 主体类，游戏启动入口
 */
export default class Main {
  private readonly canvas = document.getElementById('canvas') as HTMLCanvasElement;
  private readonly dataStore = DataStore.getInstance();
  private readonly director = Director.getInstance();

  public constructor() {
    this.onLoadResource();
  }

  private async onLoadResource(): Promise<void> {
    let res: Map<string, HTMLImageElement> = new Map();
    try {
      [res] = await ResourceLoader.getInstance().onLoad();
    } catch (e) {
      console.error(`Promise Error: ${e}`);
    }
    this.dataStore.ctx = this.canvas.getContext('2d');
    this.dataStore.res = res;
    this.init();
  }

  private init(): void {
    // 初始化设置游戏结束标志为 false
    this.dataStore.isGameOver = false;
    this.dataStore
      .set('background', Background)
      .set('land', Land)
      .set('pencils', Array)
      .set('birds', Birds)
      .set('startButton', StartButton) // 添加开始按钮对象
      .set('score', Score);
    this.registerEvent();
    // 游戏开始前先创建一组铅笔
    this.director.createPencils();
    this.director.run();
  }

  private registerEvent(): void {
    this.canvas.addEventListener(
      'touchstart',
      (e): void => {
        e.preventDefault();
        if (this.dataStore.isGameOver) {
          console.log('游戏开始');
          this.init();
        } else {
          this.director.birdsFly();
        }
      }
    );
  }
}
