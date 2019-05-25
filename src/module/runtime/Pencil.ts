/**
 * 铅笔的基类
 */
import Sprite from '@/module/base/Sprite';
import Director from '@/module/Director';

export default class Pencil extends Sprite {
  public top: number;

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
    this.x -= Director.getInstance().moveSpeed;
    super.draw();
  }
}
