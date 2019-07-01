/**
 * 初始化整个游戏的精灵，作为游戏开始的入口
 */
import Land from '@/modules//runtime/Land';
import Director from '@/modules//Director';
import Birds from '@/modules//player/Birds';
import Score from '@/modules//player/Score';
import DataStore from '@/modules/base/DataStore';
import BackGround from '@/modules//runtime/BackGround';
import StartButton from '@/modules/player/StartButton';
import ResourceLoader from '@/modules/base/ResourceLoader';

export default class Main {
  private readonly canvas = document.getElementById('canvas') as HTMLCanvasElement;
  private readonly dataStore = DataStore.getInstance();
  private readonly director = Director.getInstance();

  public constructor() {
    this.onResourceFirstLoaded();
  }

  private async onResourceFirstLoaded(): Promise<void> {
    let res: Map<string, HTMLImageElement> = new Map();
    try {
      [res] = await ResourceLoader.getInstance().onLoaded();
    } catch (e) {
      console.error(`Promise Error: ${e}`);
    }
    // 给 dataStore 赋值，这些不需要重新生成的
    this.dataStore.ctx = this.canvas.getContext('2d');
    this.dataStore.res = res;
    this.init();
  }

  private init(): void {
    // 控制游戏是否结束
    this.director.isGameOver = false;
    this.dataStore
      .set('background', BackGround)
      .set('land', Land)
      .set('pencils', Array)
      .set('birds', Birds)
      .set('startButton', StartButton)
      .set('score', Score);
    this.registerEvent();
    // 在游戏开始前创建第一组铅笔
    this.director.createPencil();
    // run 方法绘制图像
    this.director.run();
  }

  private registerEvent(): void {
    this.canvas.addEventListener(
      'touchstart',
      (e: Event): void => {
        e.preventDefault();
        if (this.director.isGameOver) {
          console.log('游戏开始');
          this.init();
        } else {
          this.director.birdsEvent();
        }
      }
    );
  }
}
