import Sprite from '../base/Sprite';

/**
 * 背景类，绘制整个游戏背景图
 */
export default class Background extends Sprite {
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
      window.innerHeight
    );
  }
}
