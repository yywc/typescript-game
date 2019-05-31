/**
 * 导演类，控制游戏的逻辑
 */
import DataStore from '@/module/base/DataStore';
import PencilUp from '@/module/runtime/PencilUp';
import PencilDown from '@/module/runtime/PencilDown';
import { BorderOffset } from '@/type/Index';

export default class Director {
  private static instance: Director;
  private readonly dataStore = DataStore.getInstance();
  public readonly moveSpeed = 2;
  public isGameOver: boolean = true;

  public static getInstance(): Director {
    if (!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  // 与铅笔的碰撞检测
  private static isStrike(bird: BorderOffset, pencil: BorderOffset): boolean {
    return !(
      bird.top > pencil.bottom ||
      bird.bottom < pencil.top ||
      bird.right < pencil.left ||
      bird.left > pencil.right
    );
  }

  public createPencil(): void {
    const minTop = window.innerHeight / 8;
    const maxTop = window.innerHeight / 2;
    const top = minTop + Math.random() * (maxTop - minTop);
    this.dataStore.get('pencils').push(new PencilUp(top));
    this.dataStore.get('pencils').push(new PencilDown(top));
  }

  public birdsEvent(): void {
    const birds = this.dataStore.get('birds');
    for (let i = 0; i < 3; i += 1) {
      birds.originYList[i] = birds.birdsYList[i];
    }
    birds.time = 0;
  }

  // 检测碰撞，判断游戏是否结束
  private checkGameOver(): void {
    const birds = this.dataStore.get('birds');
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('pencils');
    const score = this.dataStore.get('score');

    const birdBorder: BorderOffset = {
      top: birds.originYList[0],
      right: birds.birdsXList[0] + birds.birdsWidthList[0],
      bottom: birds.birdsYList[0] + birds.birdsHeightList[0],
      left: birds.birdsXList[0],
    };

    pencils.forEach(
      (pencil): void => {
        const pencilBorder: BorderOffset = {
          top: pencil.dy,
          right: pencil.dx + pencil.dWidth,
          bottom: pencil.dy + pencil.dHeight,
          left: pencil.dx,
        };
        if (Director.isStrike(birdBorder, pencilBorder)) {
          console.log('撞到铅笔了');
          this.isGameOver = true;
        }
      }
    );

    if (birds.birdsYList[0] + birds.birdsHeightList[0] >= land.dy) {
      console.log('撞到地板了');
      this.isGameOver = true;
      return;
    }

    if (
      score.isScore &&
      birds.birdsXList[0] >= pencils[0].dx + pencils[0].dWidth
    ) {
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
      if (pencils[0].dx + pencils[0].dWidth <= 0 && pencils.length === 4) {
        // 推出该组铅笔，该组包含了上下两根
        pencils.shift();
        pencils.shift();
        // 开启加分
        this.dataStore.get('score').isScore = true;
      }
      // 不断创建铅笔
      if (
        pencils[0].dx <= (window.innerWidth - pencils[0].dWidth) / 2 &&
        pencils.length === 2
      ) {
        this.createPencil();
      }
      pencils.forEach((pencil): void => pencil.draw());

      this.dataStore.get('land').draw();

      this.dataStore.get('score').draw();

      this.dataStore.get('birds').draw();

      // 跑动动画
      this.dataStore.animationTimer = requestAnimationFrame(
        (): void => this.run()
      );
    } else {
      console.log('游戏结束');
      this.dataStore.get('startButton').draw();
      cancelAnimationFrame(this.dataStore.animationTimer);
      this.dataStore.destroy();
    }
  }
}
