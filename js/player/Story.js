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
      window.innerWidth / 5.5,
      window.innerHeight / 2.2,
      1000
    )
    this.ctx.fillText(
      this.story,
      window.innerWidth / 8,
      window.innerHeight / 2.5,
      1000
    )
  }
}
