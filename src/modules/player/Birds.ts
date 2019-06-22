import Sprite from '@/modules/base/Sprite';

export default class Birds extends Sprite {
  public originY: number; // 小鸟初始的位置，需要再外部利用这个值重置小鸟位置
  public birdDownedTime: number; // 小鸟自由落体的时间，计算距离
  private birdCount: number; // 切换小鸟状态个数，用来计算小鸟索引
  private birdIndex: number; // 小鸟索引，取 image 里小鸟状态
  public readonly sxList: number[]; // 小鸟在 image 里的各个位置

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
    this.dy = offsetY + this.originY <= 0 ? 0 : offsetY + this.originY;
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
