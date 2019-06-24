## 前言

在前面的编码中，已经实现了小鸟的绘制与飞行，这里主要是实现对小鸟飞行的碰撞检测。

之前我们为了简单测试效果，checkGameOver 函数只是随便写了点东西，现在先删掉，还原一个空函数，之后开始编写。

checkGameOver 函数主要是判断小鸟与陆地、小鸟与铅笔的碰撞，从而改变 this.dataStore.isGameOver 的值，达到一个游戏结束的效果，唯一复杂一点的部分就是铅笔分为上下铅笔一个组。

首先我们定义一个类型 `BorderOffset`具备上下左右四个字段，用来判断是否碰撞。

## 1. fix 小鸟飞行 bug

在此之前先修复一个小 bug，这是在小鸟飞行过程中飞到顶部会跳出屏幕，做一个限制即可。

```ts
// Birds.ts
- this.dy = offsetY + this.originY;
+ this.dy = offsetY + this.originY <= 0 ? 0 : offsetY + this.originY;
```

然后调整一下游戏难度（不然毫无乐趣啊啊啊啊）

```ts
// PencilDown.ts
- const gapBetweenTwoPencils = window.innerHeight / 8;
+ const gapBetweenTwoPencils = window.innerHeight / 7;
```

## 2. types/Index.ts

```ts
/**
 * @interface BorderOffset
 * @param top 碰撞检测对象顶部，距离窗口顶部的距离
 * @param right 碰撞检测对象右侧，距离窗口左侧的距离
 * @param bottom 碰撞检测对象底部，距离窗口顶部的距离
 * @param left 碰撞检测对象左侧，距离窗口左侧的距离
 */
export interface BorderOffset {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

## 3. Director.ts 里的 isStrike 方法

在判断铅笔与小鸟碰撞时，单独写一个 isStrike 方法，理清逻辑。传参两个 BorderOffset 的对象，返回 boolean 值。

```ts
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
```

##  4. Director.ts 里的checkGameOver 函数

```ts
import { BorderOffset } from '@/types/Index';  

  /**
   * 检测游戏是否结束
   * 需要判断是否撞到铅笔或者地板
   */
  private checkGameOver(): void {
    // 获取 image 对象
    const birds = this.dataStore.get('birds');
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('pencils');

    // 定义小鸟的四周，BorderOffset 在 types/Index.ts 里定义
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
      // 判断小鸟与铅笔是否碰撞，isStrike 在下面实现
      if (Director.isStrike(birdBorder, pencilBorder)) {
        console.log('撞到铅笔了');
        this.dataStore.isGameOver = true;
        return;
      }
    }
  }
```

