import DataStore from './base/DataStore';
import PencilUp from '@/modules/runtime/PencilUp';
import PencilDown from '@/modules/runtime/PencilDown';

export default class Director {
  private static instance: Director;
  private dataStore: DataStore = DataStore.getInstance();
  public static readonly moveSpeed = 2;

  public static getInstance(): Director {
    if (!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  public createPencils(): void {
    const minTop = window.innerHeight / 8;
    const maxTop = window.innerHeight / 2;
    const top = minTop + Math.random() * (maxTop - minTop);
    this.dataStore.get('pencils').push([new PencilUp(top), new PencilDown(top)]);
  }

  private drawPencils(): void {
    const pencils = this.dataStore.get('pencils');
    const firstPencilUp = pencils[0][0];
    // 这里就解决了我们之前的疑问，当铅笔移除屏幕并且同时存在两组的时候，我们就进行销毁
    if (firstPencilUp.dx + firstPencilUp.dWidth <= 0 && pencils.length === 2) {
      //销毁滚动到屏幕外的铅笔
      pencils.shift();
    }
    // 如果铅笔过了中间，则创建新的铅笔
    if (
      firstPencilUp.dx <= (window.innerWidth - firstPencilUp.dWidth) / 2 &&
      pencils.length === 1
    ) {
      this.createPencils();
    }
    pencils.forEach(
      (pencil): void => {
        pencil[0].draw(); // 绘制上铅笔
        pencil[1].draw(); // 绘制下铅笔
      }
    );
  }

  /**
   * run 控制游戏开始
   */
  public run(): void {
    this.dataStore.get('background').draw();
    this.drawPencils(); // 要注意绘制顺序，canvas 是覆盖的
    this.dataStore.get('land').draw();
    // 开始滚动，打开注释即可
    // this.dataStore.animationTimer = requestAnimationFrame(
    //   (): void => {
    //     this.run();
    //   }
    // );
    // 下面是取消滚动，在加入游戏开始结束逻辑时启用
    // cancelAnimationFrame(this.dataStore.animationTimer);
    // console.log('游戏开始');
  }
}
