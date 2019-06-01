## 1. 背景图绘制

在搭建好开发环境之后，这一节主要的功能时实现背景图的绘制。

## 2. 准备工作

在开始写代码前，我们先设计一下整体项目结构。

src
├── assets // 放置资源文件
├── interfaces // 接口定义
├─┬ modules // 游戏内容
│ ├── base // 通用类
│ ├── runtime // 游戏运行时的精灵
│ ├── Director.ts // 控制游戏流程和逻辑
│ ├── Main.ts // 项目主体，初始化 canvas 和添加事件等
└── types // 定义类型

## 3. 资源准备

首先就所有（包括以后会用到的图片）一起放置到 `assets` 目录下，然后在 App.ts 中 import Main.ts，并初始化，开始调用 Main.ts 里的内容。

### 3.1 App.ts

```ts
import Main from './modules/Main';

new Main();
```

游戏是建立在 canvas 上的，所有我们需要 png 图片来创建 Image 对象，进行绘制。

创建一个 `interfaces/Painter.ts` 来定义 canvas 的 `getContext().drawImage()` 方法参数的约束，同时也需要创建一个 `modules/base/Resource.ts` 文件，引入所有的图片。

### 3.2 Painter.ts

```ts
/**
 * @interface Painter canvas 画图接口
 * @param image 传入Image对象
 * @param sx 要剪裁的起始X坐标
 * @param sy 要剪裁的起始Y坐标
 * @param sWidth 剪裁的宽度
 * @param sHeight 剪裁的高度
 * @param dx 放置的x坐标
 * @param dy 放置的y坐标
 * @param dWidth 要使用的宽度
 * @param dHeight 要使用的高度
 * @function draw CanvasRenderingContext2D.drawImage()
 */
export default interface Painter {
  image: HTMLImageElement;
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;

  // 设置为可选是因为在实现的时候解构赋值了默认值
  draw(
    image?: HTMLImageElement,
    sx?: number,
    sy?: number,
    sWidth?: number,
    sHeight?: number,
    dx?: number,
    dy?: number,
    dWidth?: number,
    dHeight?: number
  ): void;
}
```

### 3.3 Resource.ts

```ts
import Background from '@/assets/background.png';
import Birds from '@/assets/birds.png';
import Land from '@/assets/land.png';
import PieDown from '@/assets/pie_down.png';
import PieUp from '@/assets/pie_up.png';
import StartButton from '@/assets/start_button.png';

/**
 * 图片资源文件，定义类型为全部只读的数组，传递给 Map 对象当参数
 */
const resource: readonly (readonly [string, string])[] = [
  ['background', Background],
  ['land', Land],
  ['pencilUp', PieUp],
  ['pencilDown', PieDown],
  ['birds', Birds],
  ['startButton', StartButton],
];
export default resource;
```

在编写上述代码后，会发现 import 处会报错，原因是 ts 不认识 png 是 module，所以我们在 `types` 下新建一个 `image.d.ts` 来声明 png 是模块。

### 3.4 image.d.ts

```ts
declare module '*.png';
```

## 4. 绘制背景实现

+ 绘制背景我们大概需要 `Main.ts` 来初始化 canvas 获得 2dContext 对象，设置图片；
+ 需要一个资源加载类 `ResourceLoader.ts` 来将 png 模块与 Image 对象建立联系；
+ 通过 `Director.ts` 来绘制图片，操作游戏开始；
+ 设置一个数据仓库 `DataStore.ts` 来存放我们对象之间需要共享的数据；
+ 需要一个精灵类 `Sprite.ts` 来实现 `Painter.ts` 接口，并实现图片绘制；
+ 需要不同的精灵子类实现不同的精灵，当前步骤主要是背景精灵 `Background.ts`；

创建 `modules/base/ResourceLoader.ts`、`modules/Director.ts`、`nodules/base/DataStore.ts`，并利用单例模式创建对象，单例模式保证了这些对象在运行中只会有一个对象存在。

```ts
export default class Xyz {
  private static instance: Xyz; // 私有静态变量，返回的是 Xyz 实例。Xyz 是上述三种
  [key: string]: any; // 如果是 DataStore.ts 则加上索引签名，方便我们在外部挂载数据，其他的不用

  public static getInstance(): Xyz { // 在外部通过 Xyz.getInstance() 方法获得实例
    if (!Xyz.instance) {
      Xyz.instance = new Xyz();
    }
    return Xyz.instance;
  }
}
```

### 4.1 Main.ts

创建 `modules/Main.ts`。

```ts
import ResourceLoader from './base/ResourceLoader';
import DataStore from './base/DataStore';
import Director from './Director';
import Background from './runtime/Background';

export default class Main {
  // 设置为私有只读，断言成 HTMLCanvasElement
  // ById 方法可能取不到正确的 dom 出现 undefined，但是我们这里知道肯定能取到 dom 元素的。
  private readonly canvas = document.getElementById('canvas') as HTMLCanvasElement;
  private readonly dataStore = DataStore.getInstance(); // 获取 DataStore 实例
  private readonly director = Director.getInstance(); // 获取 Director 实例

  /**
   * 定义公有是 App.ts 中使用 new 初始化了对象，一般不需要在外部调用的我们统一设置成 private
   */
  public constructor() {
    // 加载资源
    this.onLoadResource();
  }

  // 加载资源涉及到 image.onload 事件，所以肯定是异步函数，这里不需要返回值，所以是 Promise<void>
  private async onLoadResource(): Promise<void> {
    let res: Map<String, HTMLImageElement> = new Map(); // 存放资源对象的 Map 对象
    try {
      /**
       * @todo 在 ResourceLoader 中实现 onLoad 函数返回一个 Image 加载完成后的 Map 数组
       */
      [res] = ResourceLoader.getInstance().onLoad();
    } catch(e) {
      console.error(`Promise Error: ${e}`);
    }
    // dataStore 挂载共享数据
    this.dataStore.ctx = this.canvas.getContext('2d');
    this.dataStore.res = res;
    // 初始化
    this.init();
  }

  private init(): void {
    /**
     * @todo 在 dataStore 和 director 中分别实现
     */
    this.dataStore.set('background', Background);
    this.director.run();
  }
}
```

### 4.2 ResourceLoader.ts

```ts
import resource from './Resource';

export default class ResourceLoader {
  private static instance: ResourceLoader;
  // 存储所有的图片
  private readonly map: Map<string, HTMLImageElement> = new Map();

  // 不需要在外部初始化，设置为私有
  private constructor() {
    const imageMap = new Map(resource); // 获得 key 为图片名，value 为路径的图片字符串 Map 对象
    let img: HTMLImageElement; // 声明 img 为 HTMLImageElement 对象类型

    // 这里 imageMap 的类型推断可以推断出 value 和 key 的类型，我们不需要额外声明
    imageMap.forEach((value, key): void => {
      img = new Image();
      img.src = value;
      this.map.set(key, img);
    })
  }

  public static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }

  public onLoad(): Promise<Map<string, HTMLImageElement>[]> {
    type PromiseMap = Promise<Map<string, HTMLImageElement>;
    const pr: PromiseMap[] = []; // 存放所有图片加载的 Promise
    let p: PromiseMap;

    this.map.forEach((img): void => {
      p = new Promise((reject, resolve): void => {
        img.onload = (): void => resolve(this.map); // 将已经 onload 的含有本张图片的 map resolve 出去
        img.onerror = (): void => reject(new Error('Could not load image '));
      });
      pr.push(p);
    })
    // 加载所有的 img
    return Promise.all(pr);
  }
}
```

### 4.3 Director.ts

```ts
import DataStore from './base/DataStore';

export default class Director {
  private static instance: Director;
  private dataStore: DataStore = DataStore.getInstance();

  public static getInstance(): Director {
    if (!Director.instance) {
      Director.instance = new Director();
    }
    return Director.instance;
  }

  /**
   * run 控制游戏开始
   */
  public run(): void {
    /**
     * @todo 在 dataStore 里实现
     */
    this.dataStore.get('background').draw();
    console.log('游戏开始');
  }
}
```

### 4.4 DataStore.ts

在写 `DataStore.ts` 之前，我们回想一下，之前在调用 set get 方法的时候，我们并没有对参数和获得的值限定类型，那么在此之前，我们先来限定一下加入的类型。

在这里来看，只添加了一个 Background 类型，但是在后面的步骤中会有一些其他的类型加入进来，所以我们创建一个 `types/Index.ts` 文件，来规范一下我们 set 的类型和 get 的类型。

```ts
import Painter from '@/interfaces/Painter';

/**
 * 定义复杂类型
 */

/**
 * @type DataStoreSet 联合类型（之后会有更多类型，先这样定义出来）
 * @typedef (new()=>Painter) 实现 Painter 接口的构造器
 */
export type DataStoreSet = new () => Painter;

/**
 * @type DataStoreGet 交叉类型（之后会有更多类型，先这样定义出来），获取时包含所有值的对象与方法
 * @typedef Painter Painter 对象，包含 Background 等资源对象
 */
export type DataStoreGet = Painter;
```

再开始编写 `DataStore.ts` 文件。

```ts
import { DataStoreGet, DataStoreSet } from '@/types/Index'; // 引入类型文件

export default class DataStore {
  private static instance: DataStore;
   // 存放的值设置为 any 类型，我们只对 set get 时进行校验
  private readonly map: Map<string, any> = new Map();
  [key: string]: any; // 通过外部挂载的数据

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  public set(key: string, value: DataStoreSet): DataStore {
    let mapValue: any = value;
    // 如果是构造函数，则构造对象，否则直接设置到 map
    if (typeof value === 'function') {
      mapValue = new value();
    }
    this.map.set(key, mapValue);
    return this; // return this 方便链式调用
  }

  public get(key: string): DataStoreGet {
    return this.map.get(key);
  }
}
```

### 4.5 Sprite.ts & Background.ts

创建 `modules/base/Sprite.ts` 和 `modules/runtime/Background.ts`。

上面的主要步骤已经完成的差不多了，剩下最关键的部件，就是从 dataStore 里 get 到数据后的 draw 方法，绘制到 canvas 上面。

这里主要是两个部分，一个是精灵基类 `Sprite.ts` 实现 `Painter.ts` 接口，并提供 draw 方法，子类继承自此，可以实现自己不同的 draw 方法，绘制不同的效果。

#### Sprite.ts

```ts
import Painter from '@/interfaces/Painter';
import DataStore from './DataStore';

export default class Sprite implements Painter {
  public ctx: CanvasRenderingContext2D = DataStore.getInstance().ctx;
  public image: HTMLImageElement;
  public sx: number;
  public sy: number;
  public sWidth: number;
  public sHeight: number;
  public dx: number;
  public dy: number;
  public dWidth: number;
  public dHeight: number;

  public constructor(
    image = new Image(),
    sx = 0,
    sy = 0,
    sWidth = 0,
    sHeight = 0,
    dx = 0,
    dy = 0,
    dWidth = 0,
    dHeight = 0
  ) {
    this.ctx = DataStore.getInstance().ctx;
    this.image = image;
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
    this.dx = dx;
    this.dy = dy;
    this.dWidth = dWidth;
    this.dHeight = dHeight;
  }

  // 从 dataStore 的 res 中取出 Image 图片对象，方便在子类中获取图片
  public static getImage(key: string): HTMLImageElement {
    return DataStore.getInstance().res.get(key) as HTMLImageElement;
  }

  public draw(
    image = this.image,
    sx = this.sx,
    sy = this.sy,
    sWidth = this.sWidth,
    sHeight = this.sHeight,
    dx = this.dx,
    dy = this.dy,
    dWidth = this.dWidth,
    dHeight = this.dHeight
  ): void {
    // 调用 CanvasRenderingContext2D 对象的 draw 方法进行绘制
    this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
}
```

#### Background.ts

```ts
import Sprite from '../base/Sprite';

/**
 * 背景类，绘制整个游戏背景图
 */
export default class Background extends Sprite {
  public constructor() {
    // 通过 Sprite.getImage() 从 dataStore 的 res 对象中取得 Image 对象
    const image = Sprite.getImage('background');
    // 调用父类构造器，传入参数，从而使得父类的 draw
    // 再通过 .draw() 方法就能绘制图片了
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
  }
}
```

## 5. 回顾

我们来回顾一下绘制背景图的操作。

1. App.ts 实例化 Main.ts 开始启动游戏（new Main()）；
2. Main.ts 通过 ResourceLoader.ts 加载资源存储到 DataStore(this.dataStore.res) 上，再借用 Director.ts 操作游戏流程与绘制精灵(this.director.run())；
3. Director.ts 操作精灵子类绘制不同精灵(extends 和 draw())；

其他部分都是对这个主要流程的补充。如 `interfaces/Painter.ts` 约束好 `Sprite.ts` 的参数；`types/Index.ts` 定义全局的一些类型约束我们参数的类型或者返回值的类型；`Resource.ts` 集合我们所需要的资源数据；

绘制背景图的步骤有点多，很多步骤属于事先定义好，将来会扩展的操作，所以在后面的步骤中会方便很多，游戏主体已经差不多形成了，剩下的就是绘制其他精灵，已经游戏逻辑的控制。
