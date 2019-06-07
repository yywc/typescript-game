## 1. Pencil 组绘制

pencil 出现时分为上下一对，也就是两根铅笔为1组，这里先定义一个 Pencil 基类，然后各自用上下子类来继承自父类绘制。

## 2. Pencil 父类

定义一个 Pencil 的父类，实现基本的铅笔绘制，具体位置的实现由子类完成。

由于铅笔也是需要不断移动和创建的过程，速度与陆地移动一致，所以我们将陆地类的速度保存到 `Director.ts` 中作为常量使用。

```typescript
import Sprite from '@/modules/base/Sprite';
import Director from '@/modules/Director';

export default class Pencil extends Sprite {
  protected top: number;

  /**
   * @constructor
   * @param image 子类实现获取上下铅笔
   * @param top 铅笔与顶部的距离，计算 dy，生产长短不一的铅笔组
   */
  public constructor(image: HTMLImageElement, top: number) {
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      window.innerWidth, // 绘制在屏幕外
      0,
      image.width,
      image.height
    );
    this.top = top;
  }

  public draw(): void {
    // 不断移动的 x。
    // ？留一个疑问，一直往左，铅笔对象不是越来越多了吗？（后面有说明）
    this.dx -= Director.moveSpeed;
    super.draw();
  }
}
```



## 3. PencilUp 上铅笔

上铅笔继承自铅笔父类，需要处理的只有铅笔 image 对象以及绘制长短。

```typescript
import Pencil from '@/modules/runtime/Pencil';
import Sprite from '@/modules/base/Sprite';

export default class PencilUp extends Pencil {
  public constructor(top: number) {
    super(Sprite.getImage('pencilUp'), top);
  }

  public draw(): void {
    this.dy = this.top - this.dHeight; // top 值 - 图片值，其实结果就是图片往上偏移的值
    super.draw();
  }
}
```

##  4. PencilDown 下铅笔

下铅笔与上铅笔类似，唯一的区别是绘制下铅笔时，中间要留一个宽度让小鸟飞过，多一个 gap 值。

```typescript
import Pencil from '@/modules/runtime/Pencil';
import Sprite from '@/modules/base/Sprite';

export default class PencilDown extends Pencil {
  public constructor(top: number) {
    super(Sprite.getImage('pencilDown'), top);
  }

  public draw(): void {
    // gap 值，屏幕高度的一部分，根据自己喜好调整，值越大游戏越容易
    const gapBetweenTwoPencils = window.innerHeight / 8;
    // 最终下铅笔（我们可以看到）的高度，top 的值加上 gap 值
    this.dy = this.top + gapBetweenTwoPencils;
    super.draw();
  }
}
```

## 5. 绘制铅笔组

在绘制之前，我们需要设置一下铅笔的图片。与绘制背景、陆地一样，我们现在 `Main.ts` 中挂载 image 到 `DataStore` 上，与之前不同的是，我们这里先 set 一个空数组，在 `Director.ts` 中通过 createPencils 方法实现。

### 5.1 Main.ts

```typescript
this.dataStore
  .set('background', Background)
  .set('land', Land)
+  .set('pencils', []);
+ // 游戏开始前先创建一组铅笔
+ this.director.createPencils();
```

细心的观众朋友会发现这里 set 空数组报错了，这时候回忆一下之前的一个操作，type!

没错，我们在 `type/Index.ts` 里设置一下类型。

### 5.2 type/Index.ts

```typescript
import Painter from '@/interfaces/Painter';

/**
 * 定义复杂类型
 */

/**
 * @type DataStoreSet 联合类型（之后会有更多类型，先这样定义出来）
 * @typedef (new()=>Painter) 实现 Painter 接口的构造器
 * @typedef Painter[][] painter 数组，主要存放铅笔对象，上下为一组
 */
export type DataStoreSet = (new () => Painter) | Painter[][];

/**
 * @type DataStoreGet 交叉类型（之后会有更多类型，先这样定义出来），获取时包含所有值的对象与方法
 * @typedef Painter Painter 对象，包含 Background、land 等资源对象
 * @typedef Painter[][] 存放的铅笔对象，上下铅笔为一组
 */
export type DataStoreGet = Painter & Painter[][];
```

接着就会发现报错神奇的解决了，这也是静态类型检查的一个好处。

下一步就是在 `Director.ts` 中实现 createPencils 以及绘制到 canvas 上了。

### 5.3 Director.ts

```typescript
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
      },
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
```
