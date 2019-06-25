import DataStore from './base/DataStore';
import PencilUp from '@/modules/runtime/PencilUp';
import PencilDown from '@/modules/runtime/PencilDown';
import { BorderOffset } from '@/types/Index';

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
      // 开启加分
      this.dataStore.get('score').isScore = true;
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
   * 判断是否碰撞（数字不影响主要逻辑，为了视觉效果）：
   * - 为了逻辑好梳理，我们判断未碰撞情况取反就可以了：
   * -- 1. 小鸟在铅笔左侧：bird.right < pencil.left
   * -- 2. 小鸟在铅笔右侧 bird.left < pencil.right
   * -- 3. 小鸟在管道内 bird.top > pencil.top && bird.bottom < pencil.bottom
   */
  private static isStrike(bird: BorderOffset, pencil: BorderOffset): boolean {
    return !(
      bird.right < pencil.left + 5 ||
      bird.left > pencil.right - 10 ||
      (bird.top > pencil.top && bird.bottom < pencil.bottom)
    );
  }

  /**
   * 检测游戏是否结束
   * 需要判断是否撞到铅笔或者地板
   */
  private checkGameOver(): void {
    // 获取 image 对象
    const birds = this.dataStore.get('birds');
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('pencils');
    const score = this.dataStore.get('score');

    // 定义小鸟的四周
    const birdBorder: BorderOffset = {
      top: birds.dy, // 顶部坐标就是起始位置
      right: birds.dx + birds.dWidth, // 右侧坐标是起始位置+小鸟本身宽度
      bottom: birds.dy + birds.dHeight,
      left: birds.dx,
    };

    // 判断是否撞到地板，多加数字 5 是起一个视觉调整作用
    if (birds.dy + birds.dHeight + 5 >= land.dy) {
      console.log('撞到地板了');
      this.dataStore.isGameOver = true;
      return;
    }

    // 判断是否与铅笔相撞
    for (let i = 0, len = pencils.length; i < len; i += 1) {
      const pencil = pencils[i]; // 获取当前铅笔组
      // 当前铅笔对象的四周：左右为左右，上部取上铅笔的底部，下部取下铅笔的顶部
      // 也就是中间通道的四边坐标
      const pencilBorder: BorderOffset = {
        top: pencil[0].dy + pencil[0].dHeight,
        right: pencil[0].dx + pencil[0].dWidth,
        bottom: pencil[1].dy,
        left: pencil[0].dx,
      };
      // 判断小鸟与铅笔是否碰撞
      if (Director.isStrike(birdBorder, pencilBorder)) {
        console.log('撞到铅笔了');
        this.dataStore.isGameOver = true;
        return;
      }

      // 加分状态且小鸟越过了第一组铅笔的右侧
      if (score.isScore && birds.dx >= pencils[0][0].dx + pencils[0][0].dWidth) {
        // 结束加分
        score.isScore = false;
        score.scoreNumber += 1;
      }
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
      this.dataStore.get('score').draw();
      this.dataStore.get('birds').draw();
      this.dataStore.animationTimer = requestAnimationFrame((): void => this.run());
    } else {
      console.log('游戏结束');
      this.dataStore.get('startButton').draw();
      cancelAnimationFrame(this.dataStore.animationTimer);
      this.dataStore.destroy(); // 清空上场游戏的数据
    }
  }
}
