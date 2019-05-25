/**
 * 导演类，控制游戏的逻辑
 */
import DataStore from '@/module/base/DataStore';
import UpPencil from '@/module/runtime/UpPencil';
import DownPencil from '@/module/runtime/DownPencil';

interface Border {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export default class Director {
  private static _instance: Director;
  public dataStore: DataStore;
  public moveSpeed: number;
  public isGameOver: boolean;

  public static getInstance(): Director {
    if (!Director._instance) {
      Director._instance = new Director();
    }
    return Director._instance;
  }

  private constructor() {
    this.dataStore = DataStore.getInstance();
    this.moveSpeed = 2;
  }

  // 与铅笔的碰撞检测
  public static isStrike(bird: Border, pencil: Border): boolean {
    return !(
      bird.top > pencil.bottom
      || bird.bottom < pencil.top
      || bird.right < pencil.left
      || bird.left > pencil.right
    );
  }

  public createPencil(): void {
    const minTop: number = window.innerHeight / 8;
    const maxTop: number = window.innerHeight / 2;
    const top: number = minTop + Math.random() * (maxTop - minTop);
    this.dataStore.get('pencils').push(new UpPencil(top));
    this.dataStore.get('pencils').push(new DownPencil(top));
  }

  public birdsEvent(): void {
    const birds = this.dataStore.get('birds');
    for (let i = 0; i < 3; i += 1) {
      birds.originY[i] = birds.birdsY[i];
    }
    birds.time = 0;
  }

  // 检测碰撞，判断游戏是否结束
  public checkGameOver(): void {
    const birds = this.dataStore.get('birds');
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('pencils');
    const score = this.dataStore.get('score');

    const birdBorder: Border = {
      top: birds.originY[0],
      right: birds.birdsX[0] + birds.birdsWidth[0],
      bottom: birds.birdsY[0] + birds.birdsHeight[0],
      left: birds.birdsX[0],
    };

    for (const pencil of pencils) {
      const pencilBorder: Border = {
        top: pencil.y,
        right: pencil.x + pencil.width,
        bottom: pencil.y + pencil.height,
        left: pencil.x,
      };
      if (Director.isStrike(birdBorder, pencilBorder)) {
        console.log('撞到铅笔了');
        this.isGameOver = true;
      }
    }

    if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
      console.log('撞到地板了');
      this.isGameOver = true;
      return;
    }

    if (score.isScore && birds.birdsX[0] >= (pencils[0].x + pencils[0].width)) {
      // 结束加分
      score.isScore = false;
      score.scoreNumber += 1;
    }
  }

  public run(): void {
    this.checkGameOver();
    if (!this.isGameOver) {
      // 绘制相关精灵
      this.dataStore.get('background').draw();

      const pencils = this.dataStore.get('pencils');
      // 销毁铅笔
      if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
        // 推出该组铅笔，该组包含了上下两根
        pencils.shift();
        pencils.shift();
        // 开启加分
        this.dataStore.get('score').isScore = true;
      }
      // 不断创建铅笔
      if (pencils[0].x <= (window.innerWidth - pencils[0].width) / 2 && pencils.length === 2) {
        this.createPencil();
      }
      pencils.forEach((pencil: any): void => pencil.draw());

      this.dataStore.get('land').draw();

      this.dataStore.get('score').draw();

      this.dataStore.get('birds').draw();

      // 跑动动画
      const animationTimer: number = requestAnimationFrame((): void => this.run());
      this.dataStore.put('animationTimer', animationTimer);
    } else {
      console.log('游戏结束');
      this.dataStore.get('startButton').draw();
      cancelAnimationFrame(this.dataStore.get('animationTimer'));
      this.dataStore.destroy();
    }
  }
}
