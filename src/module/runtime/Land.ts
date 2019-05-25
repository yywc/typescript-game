/**
 * 陆地类
 */
import Sprite from '@/module/base/Sprite';
import Director from '@/module/Director';

export default class Land extends Sprite {
  public landX: number;
  public landSpeed: number;

  public constructor() {
    const image: HTMLImageElement = Sprite.getImage('land');
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      window.innerHeight - image.height,
      // 使用图片的大小
      image.width,
      image.height,
    );
    this.landX = 0;
    this.landSpeed = Director.getInstance().moveSpeed;
  }

  public draw(): void {
    this.landX += this.landSpeed;
    if (this.landX > (this.img.width - window.innerWidth)) {
      this.landX = 0;
    }
    this.x = -this.landX;
    super.draw();
  }
}
