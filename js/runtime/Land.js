/**
 * 陆地类
 */
import { Sprite } from '../base/Sprite.js'
import { Director } from '../Director.js'

export class Land extends Sprite {
  constructor() {
    const image = Sprite.getImage('land')
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
      image.height
    )
    this.landX = 0
    this.landSpeed = Director.getInstance().moveSpeed
  }

  draw() {
    this.landX += this.landSpeed
    if (this.landX > (this.img.width - window.innerWidth)) {
      this.landX = 0
    }
    this.x = -this.landX
    super.draw()
  }
}
