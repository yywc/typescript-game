/**
 * 背景类
 */
import { Sprite } from '../base/Sprite.js'
import { DataStore } from '../base/DataStore.js'

export class BackGround extends Sprite {
  constructor() {
    const image = Sprite.getImage('background')
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      // 使用图片的大小
      DataStore.getInstance().canvas.width,
      DataStore.getInstance().canvas.height
    )
  }
}
