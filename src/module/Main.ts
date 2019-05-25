/**
 * 初始化整个游戏的精灵，作为游戏开始的入口
 */
import Land from '@/module//runtime/Land';
import Director from '@/module//Director';
import Birds from '@/module//player/Birds';
import Score from '@/module//player/Score';
import DataStore from '@/module/base/DataStore';
import BackGround from '@/module//runtime/BackGround';
import StartButton from '@/module/player/StartButton';
import ResourceLoader from '@/module/base/ResourceLoader';

export default class Main {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public dataStore: DataStore;
  public director: Director;

  public constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.dataStore = DataStore.getInstance();
    this.director = Director.getInstance();
    this.onResourceFirstLoaded();
  }

  public async onResourceFirstLoaded(): Promise<void> {
    let res: Map<string, HTMLImageElement>;
    try {
      [res] = await ResourceLoader.create().onLoaded();
    } catch (e) {
      console.error(`Promise Error: ${e}`);
    }
    // 给 dataStore 赋值，这些不需要重新生成的
    this.dataStore.ctx = this.ctx;
    this.dataStore.canvas = this.canvas;
    this.dataStore.res = res;
    this.init();
  }

  public init(): void {
    // 控制游戏是否结束
    this.director.isGameOver = false;
    this.dataStore
      .put('background', BackGround)
      .put('land', Land)
      .put('pencils', [])
      .put('birds', Birds)
      .put('startButton', StartButton)
      .put('score', Score);
    this.registerEvent();
    // 在游戏开始前创建第一组铅笔
    this.director.createPencil();
    // run 方法绘制图像
    this.director.run();
  }

  public registerEvent(): void {
    this.canvas.addEventListener('touchstart', (e: Event): void => {
      e.preventDefault();
      if (this.director.isGameOver) {
        console.log('游戏开始');
        this.init();
      } else {
        this.director.birdsEvent();
      }
    });
  }
}
