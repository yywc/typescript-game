## 前言

到上一步骤为止，游戏主体基本上完成，这也是最后一个部分，实现游戏的开关与积分。

## 1. 游戏开关按钮

首先还是老规矩，在 player 目录下创建 `StartButton.ts` 文件，export `StartButton`类。

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

###  1.1 Main.ts 里给 dataStore set 这个类对象。

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

### 1.2 Main.ts

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

### 1.3 DataStore.ts 实现 destroy 方法

```ts
  public destroy(): void {
    for (const key of this.map.keys()) {
      this.map.set(key, null); // 置空所有 key 对应的 value 值
    }
  }
```

## 2. 计分功能

如出一辙，首先在 player 目录下创建 `Score.ts`类，里面需要一个变量存储当前分数以及判断是否要计算分数，另外就是一个 draw 方法绘制到 canvas 上。

### 2.1 Score.ts

```ts
/**
 * 计分器类
 */
import DataStore from '@/modules/base/DataStore';

export default class Score {
  // 从 dataStore 获取 canvas 下的 2D 对象
  private ctx: CanvasRenderingContext2D = DataStore.getInstance().ctx;
  public scoreNumber: number = 0; // 分数
  public isScore: boolean = true; // 是否加分，防止过速渲染加分

  public draw(): void {
    this.ctx.font = '25px Arial'; // 定义绘制文字的字体、大小
    this.ctx.fillStyle = '#333'; // 定义绘制文字的颜色
    // 参考 fillText 方法
    this.ctx.fillText(
      this.scoreNumber.toString(),
      window.innerWidth / 2,
      window.innerHeight / 22,
      1000
    );
  }
}
```

### 2.2 Main.ts

然后在 Main.ts 中 set 到 dataStore 中去

```ts
+ import Score from '@/modules/player/Score';

  this.dataStore
    .set('background', Background)
    .set('land', Land)
    .set('pencils', [])
    .set('birds', Birds)
-     .set('startButton', StartButton); // 添加开始按钮对象
+     .set('startButton', StartButton) // 添加开始按钮对象
+     .set('score', Score);
```

细心的同学会发现这里报错了，原因是我们在 types/Index.ts 中被未指定 dataStore set 时的对象包含 Score，于是我们再在 types/Index.ts 中补充：

```ts
+ import Score from '@/modules/player/Score';

/**
 * @type DataStoreSet 联合类型（之后会有更多类型，先这样定义出来）
 * @typedef (new()=>Painter|Score) 实现 Painter 接口的构造器和 Score 类构造器
 * @typedef Painter[][] painter 数组，主要存放铅笔对象，上下为一组
 * @typedef Score 积分对象
 */
- export type DataStoreSet = (new () => Painter) | Painter[][] | Birds;
+ export type DataStoreSet = (new () => Painter | Score) | Painter[][];

/**
 * @type DataStoreGet 交叉类型（之后会有更多类型，先这样定义出来），获取时包含所有值的对象与方法
 * @typedef Painter Painter 对象，包含 Background、Land 等资源对象
 * @typedef Score 未实现 Painter，所以要单独合并
 * @typedef Painter[][] 存放的铅笔对象，上下铅笔为一组
 * @typedef Score 积分对象
 */
- export type DataStoreGet = Painter & Painter[][] & Birds;
+ export type DataStoreGet = Painter & Painter[][] & Birds & Score;
```

这样写完，重新启动一下环境，报错问题就解决了。

### 2.3 Director.ts

Score 默认是加分的，于是我们再 run 方法中直接绘制出来开始的得分，然后在小鸟越过铅笔且是加分状态的时候开启加分，同时将加分状态设置为 false， 防止一秒内渲染多次，造成加分多次。

```ts
// checkGameOver 方法中
const pencils = this.dataStore.get('pencils');
+ const score = this.dataStore.get('score'); // 获取加分对象

// 判断小鸟与铅笔是否碰撞
if (Director.isStrike(birdBorder, pencilBorder)) {
  console.log('撞到铅笔了');
  this.dataStore.isGameOver = true;
  return;
}

// 加分状态且小鸟越过了第一组铅笔的右侧
+ if (score.isScore && birds.dx >= pencils[0][0].dx + pencils[0][0].dWidth) {
+   // 结束加分
+   score.isScore = false;
+   score.scoreNumber += 1;
+ }
```

此时加分状态已经关闭，我们需要在合适的机会开启这个状态，合适的机会就是在销毁前一组铅笔的时候。

```ts
private drawPencils(): void {
  const pencils = this.dataStore.get('pencils');
  const firstPencilUp = pencils[0][0];
  // 这里就解决了我们之前的疑问，当铅笔移除屏幕并且同时存在两组的时候，我们就进行销毁
  if (firstPencilUp.dx + firstPencilUp.dWidth <= 0 && pencils.length === 2) {
    //销毁滚动到屏幕外的铅笔
    pencils.shift();
+     // 开启加分
+     this.dataStore.get('score').isScore = true;
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
```

## 3. 调整

之前在 DataStore 里有 DataStoreGet 与 DataStoreSet 两个类型，这里可以使用泛型对其进行调整。

先从 types/Index.ts 删掉两个类型，然后修改对应的地方。

+ DataStore.ts

  ```ts
  - import { DataStoreGet, DataStoreSet } from '@/types/Index';
  
    // get、set 方法修改如下
    public set<T>(key: string, Constructor: { new (): T }): DataStore {
      this.map.set(key, new Constructor());
      return this;
    }
  
    public get<T>(key: string): T {
      return this.map.get(key);
    }
  ```

+ Main.ts

  ```ts
  // 由于限定 set 的值只能是个构造函数，所以 [] 要改成对应的构造形式 Array
  - .set('pencils', [])
  + .set('pencils', Array)
  ```

+ Director.ts

  在所有 this.dataStore.set/get 的地方全部使用泛型来代替，修改后内容如下：

  ```ts
  import DataStore from './base/DataStore';
  import PencilUp from '@/modules/runtime/PencilUp';
  import PencilDown from '@/modules/runtime/PencilDown';
  import { BorderOffset } from '@/types/Index';
  import Birds from '@/modules/player/Birds';
  import Land from '@/modules/runtime/Land';
  import Score from '@/modules/player/Score';
  import BackGround from '@/modules/runtime/BackGround';
  import StartButton from '@/modules/player/StartButton';
  
  type Pencils = [PencilUp, PencilDown][];
  
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
      this.dataStore.get<Pencils>('pencils').push([new PencilUp(top), new PencilDown(top)]);
    }
  
    private drawPencils(): void {
      const pencils = this.dataStore.get<Pencils>('pencils');
      const firstPencilUp = pencils[0][0];
      // 这里就解决了我们之前的疑问，当铅笔移除屏幕并且同时存在两组的时候，我们就进行销毁
      if (firstPencilUp.dx + firstPencilUp.dWidth <= 0 && pencils.length === 2) {
        //销毁滚动到屏幕外的铅笔
        pencils.shift();
        // 开启加分
        this.dataStore.get<Score>('score').isScore = true;
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
      const bird = this.dataStore.get<Birds>('birds');
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
      const birds = this.dataStore.get<Birds>('birds');
      const land = this.dataStore.get<Land>('land');
      const pencils = this.dataStore.get<Pencils>('pencils');
      const score = this.dataStore.get<Score>('score');
  
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
        this.dataStore.get<BackGround>('background').draw();
        this.drawPencils(); // 要注意绘制顺序，canvas 是覆盖的
        this.dataStore.get<Land>('land').draw();
        this.dataStore.get<Score>('score').draw();
        this.dataStore.get<Birds>('birds').draw();
        this.dataStore.animationTimer = requestAnimationFrame((): void => this.run());
      } else {
        console.log('游戏结束');
        this.dataStore.get<StartButton>('startButton').draw();
        cancelAnimationFrame(this.dataStore.animationTimer);
        this.dataStore.destroy(); // 清空上场游戏的数据
      }
    }
  }
  ```

## 总结

整个游戏的重构也就写完了，比起对着视频敲更多了一些自己的思考与操作。回顾一下整个游戏开发流程：

1. 定义好各个类、基类，类型、接口，然后通过类来实现；
2. DataStore.ts 控制游戏数据、Director.ts 控制游戏流程、Main.ts 控制游戏起始；
3. 首先绘制好背景、陆地、铅笔等精灵，然后通过动画使其运动；
4. 根据小鸟索引来从 png 图上获取对应的小鸟状态，达到一个飞行的效果；
5. 给 canvas 绑定点击事件，游戏结束时点击则初始化游戏，游戏进行时点击则“重置”小鸟的状态，使其往上飞行；
6. 最后就是绘制游戏开始按钮以及判断加分系统；

这样下来，温故知新了 webpack 打包，typescript 环境配置，面向对象编程思想、面向接口编程思想以及 typescript 在项目中的使用。
