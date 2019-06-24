## 前言

到上一步骤为止，游戏主体基本上完成，这也是最后一个部分，实现游戏的开关与积分

## 1. 游戏开关按钮

首先还是老规矩，在 player 目录下创建 `StartButton.ts` 文件，export `StrartButton`类。

```ts
/**
 * 开始按钮类
 */
import Sprite from '@/modules/base/Sprite';

export default class StartButton extends Sprite {
  public constructor() {
    const image = Sprite.getImage('startButton');
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      (window.innerWidth - image.width) / 2,
      (window.innerHeight - image.height) / 2.5,
      image.width,
      image.height
    );
  }
}
```

###  1.1 `Main.ts `里给 dataStore set 这个类对象。

```ts
+ import StartButton from '@/modules/player/StartButton';

  private init(): void {
+     // 初始化设置游戏结束标志为 false
+     this.dataStore.isGameOver = false;
    this.dataStore
      .set('background', Background)
      .set('land', Land)
      .set('pencils', [])
-       .set('birds', Birds);
+       .set('birds', Birds)
+       .set('startButton', StartButton); // 添加开始按钮对象
    this.registerEvent();
    // 游戏开始前先创建一组铅笔
    this.director.createPencils();
    this.director.run();
  }
```

开始按钮在首次游戏开始时并不需要绘制，而是要在小鸟碰撞到物体，游戏结束后绘制在屏幕上，提示玩家点击按钮开始游戏。

那么在 `Director.ts`的 run 方法里，如果游戏结束，则绘制按钮，同时还要清空 dataStore 里所有的数据。

### 1.2 `Main.ts`

```ts
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
+       console.log('游戏结束');
+       this.dataStore.get('startButton').draw(); // 绘制按钮
      cancelAnimationFrame(this.dataStore.animationTimer);
+       this.dataStore.destroy(); // 清空上场游戏的数据
    }
  }
```

### 1.3 `DataStore.ts`实现 destroy 方法

```ts
  public destroy(): void {
    for (const key of this.map.keys()) {
      this.map.set(key, null); // 置空所有 key 对应的 value 值
    }
  }
```

