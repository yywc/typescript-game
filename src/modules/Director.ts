import DataStore from './base/DataStore';
import PencilUp from '@/modules/runtime/PencilUp';
import PencilDown from '@/modules/runtime/PencilDown';

export default class Director {
  private static instance: Director;
  private dataStore: DataStore = DataStore.getInstance();
  public static readonly moveSpeed = 2;
  private time = 0;

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

  public birdsFly(): void {
    const bird = this.dataStore.get('birds');
    bird.originY = bird.dy;
    bird.birdDownedTime = 0;
  }

  /**
   * 检测游戏是否结束
   */
  private checkGameOver(): void {
    this.time += 1;
    if (this.time === 300) {
      this.dataStore.isGameOver = true;
    }
  }

  /**
   * run 控制游戏开始
   */
  public run(): void {
    this.checkGameOver();
    if (!this.dataStore.isGameOver) {
      this.dataStore.get('background').draw();
      this.drawPencils(); // 要注意绘制顺序，canvas 是覆盖的
      this.dataStore.get('land').draw();
      this.dataStore.get('birds').draw();
      this.dataStore.animationTimer = requestAnimationFrame((): void => this.run());
    } else {
      cancelAnimationFrame(this.dataStore.animationTimer);
    }
  }
}
