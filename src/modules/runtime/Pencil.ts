/**
 * 铅笔的基类
 */
import Sprite from '@/modules/base/Sprite';
import Director from '@/modules/Director';

export default class Pencil extends Sprite {
  protected top: number;

  public constructor(image: HTMLImageElement, top: number) {
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      window.innerWidth,
      0,
      image.width,
      image.height,
    );
    this.top = top;
  }

  public draw(): void {
    this.dx -= Director.getInstance().moveSpeed;
    // 参数为断言成 DrawImgParams 的空对象
    super.draw();
  }
}
