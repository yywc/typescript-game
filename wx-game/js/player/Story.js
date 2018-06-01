/**
 * 狗血剧情类
 */
import { DataStore } from '../base/DataStore.js'

export class Story {
  constructor() {
    this.ctx = DataStore.getInstance().ctx
    this.story = '如果凯莉与伊恩永远再见不到'
    this.story2 = '那么世界将不再拥有彩色'
  }

  draw() {
    this.ctx.font = '22px Arial'
    this.ctx.fillStyle = '#333'
    this.ctx.fillText(
      this.story2,
      DataStore.getInstance().canvas.width / 5.5,
      DataStore.getInstance().canvas.height / 2.2,
      1000
    )
    this.ctx.fillText(
      this.story,
      DataStore.getInstance().canvas.width / 8,
      DataStore.getInstance().canvas.height / 2.5,
      1000
    )
  }
}
