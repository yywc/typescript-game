## 前言

在上一个步骤中，我们实现了铅笔的绘制以及移动动画，这一篇主要是实现小鸟的绘制以及点击屏幕跳动。

先理清一下思路：

1. 与之前类似，先定义一个 birds 类，重写父类方法，绘制不同状态的小鸟；
2. 在 Main.ts 里设置到 dataStore 保存，方便其他地方使用；
3. 在 Director.ts 里控制绘制与其他事件；

## 1. 定义 birds 类

birds 类与其他类一样，继承自 Sprite.ts，但是小鸟有三种飞行状态，我们需要实时来切换，于是就需要重写父类的 draw 方法。

```ts
import Sprite from '@/modules/base/Sprite';

export default class Birds extends Sprite {
  public originY: number; // 小鸟初始的位置，需要再外部利用这个值重置小鸟位置
  public birdDownedTime: number; // 小鸟自由落体的时间，计算距离
  private birdCount: number; // 切换小鸟状态个数，用来计算小鸟索引
  private birdIndex: number; // 小鸟索引，取 image 里小鸟状态
  private readonly sxList: number[]; // 小鸟在 image 里的各个位置

  public constructor() {
    const image = Sprite.getImage('birds');
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    this.birdCount = 0;
    this.birdDownedTime = 0;
    this.birdIndex = 0;
    // 小鸟宽高，数据从 png 中量的
    const birdWidth = 34;
    const birdHeight = 24;
    // 小鸟在 canvas 中的位置
    const drawXPos = window.innerWidth / 4;
    const drawYPos = window.innerWidth / 2;
    // 小鸟宽 34，高 24，上下边距 10，左右边距 9
    this.sxList = [9, 9 + 34 + 18, 9 + 34 + 18 + 34 + 18];
    this.sy = 10;
    this.sWidth = birdWidth;
    this.sHeight = birdHeight;
    this.dx = drawXPos;
    this.dy = drawYPos;
    this.dWidth = birdWidth;
    this.dHeight = birdHeight;
    this.originY = drawYPos;
  }

  private calculateBirds(): void {
    // 切换小鸟状态个数，用以获得小鸟索引
    this.birdCount += 0.1;
    if (this.birdCount > 3) {
      this.birdCount = 0;
    }
    // 获得小鸟索引，往小取值防止浏览器刷新过快闪烁
    this.birdIndex = Math.floor(this.birdCount);
    const g = 0.98 / 2.4; // 重力加速度，缓冲一下别太快
    // 获得掉落的距离，计算方法是自由落体，gt²/2，为了点击时往上跳一下再掉下去
    // 所以就用 gt(t-t0)/2，得到一个向上的位移
    const t0 = 20;
    const offsetY = (g * this.birdDownedTime * (this.birdDownedTime - t0)) / 2;
    // 计算出要在 canvas 上画的位置
    this.dy = offsetY + this.originY;
    this.birdDownedTime += 1; // 掉落时间加一
  }

  // 核心方法
  public draw(): void {
    // 计算小鸟的各种状态，然后调用父类的 draw 方法实现绘制
    this.calculateBirds();
    super.draw(
      this.image,
      this.sxList[this.birdIndex],
      this.sy,
      this.sWidth,
      this.sHeight,
      this.dx,
      this.dy,
      this.dWidth,
      this.dHeight
    );
  }
}
```

## 2. Main.ts 保存 Birds

在 Main.ts 保存 Birds 前，我们需要在 `types/Index.ts`里将 Birds 的类型添加到 DataStoreSet、DataStoreGet 中

### 2.1 types/Index.ts

```ts
+ import Birds from '@/modules/player/Birds';

- export type DataStoreSet = (new () => Painter) | Painter[][]
+ export type DataStoreSet = (new () => Painter) | Painter[][] | Birds;

- export type DataStoreGet = Painter & Painter[][];
+ export type DataStoreGet = Painter & Painter[][] & Birds;
```

### 2.2 Main.ts

```ts
+ import Birds from '@/modules/player/Birds';

private init(): void {
  this.dataStore
   .set('background', Background)
   .set('land', Land)
-   .set('pencils', []);
+   .set('pencils', [])
+   .set('birds', Birds); // 放置 Birds 对象
  // 游戏开始前先创建一组铅笔
  this.director.createPencils();
  this.director.run();
}
```

## 3. Director.ts 绘制

```ts
public run(): void {
  this.dataStore.get('background').draw();
  this.drawPencils(); // 要注意绘制顺序，canvas 是覆盖的
  this.dataStore.get('land').draw();
+   this.dataStore.get('birds').draw();
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
```

到这里为止，我们已经成功地在 canvas 上画出了小鸟，那么如何让它随着我们的点击来飞行呢？

下面就来实现这个功能。

## 4. 小鸟飞行

让小鸟随着点击屏幕来飞行，canvas 自然是需要一个点击事件了。我们在 Main.ts 里来注册事件，与此同时，需要一个状态（isGameOver）来判断游戏是否在进行：游戏进行时则调用小鸟飞行方法，否则初始化项目重新开始游戏。



### 4.1 Main.ts 里的事件注册

```ts
+ import Birds from '@/modules/player/Birds';

private init(): void {
  this.dataStore
   .set('background', Background)
   .set('land', Land)
   .set('pencils', []);
   .set('pencils', [])
   .set('birds', Birds); // 放置 Birds 对象
+   this.registerEvent(); // 注册事件
  // 游戏开始前先创建一组铅笔
  this.director.createPencils();
  this.director.run();
}

  // 事件注册方法，只在内部使用，使用 private，且没有返回值
+ private registerEvent(): void {
+   this.canvas.addEventListener(
+     'touchstart',
+     (e): void => {
+       e.preventDefault();
+       // 判断游戏是否在进行，isGameOver 新挂载的字段，用以判断游戏状态
+       if (this.dataStore.isGameOver) {
+         console.log('游戏开始');
+         this.init();
+       } else {
+         // 小鸟飞行，下一步在 director 里实现
+         this.director.birdsFly();
+       }
+     }
+   );
+ }
```

### 4.2 Director.ts 里的小鸟飞行

在上一个步骤中，我们通过在 Main.ts 里实现 registerEvent 方法来使点击屏幕时能让小鸟飞行，重要的 birdsFly 方法现在来实现。

在实现之前，我们来思考一下，如何能让小鸟在点击屏幕来向上跳动呢？

答案其实也很简单，就是绘制的时候，把 dy 字段往上偏移一点就可以了，那么我们绘制时的 `this.dy = offsetY + this.originY;` 就是这个效果，所以我们只需要将当前的 dy 当做初始的 Y 坐标，也就是 originY 即可。

```ts
+ public birdsFly(): void {
+   const bird = this.dataStore.get('birds'); // 获取小鸟
+   // 将当前 Y 坐标作为起始 Y 坐标，这样在 this.dy = offsetY + this.originY; 计算时就会往上偏移一点点了
+   bird.originY = bird.dy;
+   // 下落时间不要忘记重置为 0
+   bird.birdDownedTime = 0;
+ }
```

同时我们简单判断一下游戏的结束，来看看效果，下一节就会来实现碰撞以及游戏的状态了。

```ts
+   private time = 0;
+   /**
+    * 检测游戏是否结束
+    */
+   private checkGameOver(): void {
+     this.time += 1;
+     if (this.time === 300) { // 计算到 300 时算游戏结束
+       this.dataStore.isGameOver = true;
+     }
+  }

  /**
   * run 控制游戏开始
   */
  public run(): void {
+     this.checkGameOver();
+     if (!this.dataStore.isGameOver) {
      this.dataStore.get('background').draw();
      this.drawPencils(); // 要注意绘制顺序，canvas 是覆盖的
      this.dataStore.get('land').draw();
+       this.dataStore.get('birds').draw();
+       this.dataStore.animationTimer = requestAnimationFrame((): void => this.run());
+     } else {
+       cancelAnimationFrame(this.dataStore.animationTimer);
+     }
  }
```

