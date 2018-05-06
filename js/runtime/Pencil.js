/**
 * 铅笔的基类
 */
import { Sprite } from '../base/Sprite.js'
import { Director } from '../Director.js'

export class Pencil extends Sprite {
  constructor(image, top) {
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      window.innerWidth,
      0,
      image.width,
      image.height
    )
    this.top = top
  }

  draw() {
    this.x -= Director.getInstance().moveSpeed
    super.draw(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
