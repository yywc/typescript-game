/**
 * 背景类
 */
import Sprite from '@/module/base/Sprite';

export default class BackGround extends Sprite {
  public constructor() {
    const image = Sprite.getImage('background');
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
    );
  }
}
