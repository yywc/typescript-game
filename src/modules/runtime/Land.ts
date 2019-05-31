/**
 * 陆地类
 */
import Sprite from '@/modules/base/Sprite';
import Director from '@/modules/Director';

export default class Land extends Sprite {
  private landX: number;
  private readonly landSpeed: number;

  public constructor() {
    const image = Sprite.getImage('land');
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      window.innerHeight - image.height,
      image.width,
      image.height
    );
    this.landX = 0;
    this.landSpeed = Director.getInstance().moveSpeed;
  }

  public draw(): void {
    this.landX += this.landSpeed;
    if (this.landX > this.image.width - window.innerWidth) {
      this.landX = 0;
    }
    this.dx = -this.landX;
    super.draw();
  }
}
