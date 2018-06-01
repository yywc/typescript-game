/**
 * 铅笔的基类
 */
import { Sprite } from '../base/Sprite.js'
import { DataStore } from '../base/DataStore.js'

export class Pencil extends Sprite {
  constructor(image, top) {
    super(
      image,
      0,
      0,
      image.width,
      image.height, 
      DataStore.getInstance().canvas.width,
      0,
      image.width,
      image.height
    )
    this.top = top
    this.moveSpeed = 2
  }

  draw() {
    this.x -= this.moveSpeed
    super.draw()
  }
}
