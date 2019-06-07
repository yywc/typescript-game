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
    // ？留一个疑问，一直往左，铅笔对象不是越来越多了吗？（readme 有说明）
    this.dx -= Director.moveSpeed;
    super.draw();
  }
}
