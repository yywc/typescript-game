/**
 * 背景类
 */
import { Sprite } from '../base/Sprite.js'

export class BackGround extends Sprite {
  constructor() {
    const img = Sprite.getImage('background')
    super(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      // 使用图片的大小
      window.innerWidth,
      window.innerHeight
    )
  }
}
