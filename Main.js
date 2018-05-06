/**
 * 初始化整个游戏的精灵，作为游戏开始的入口
 */
import { ResourceLoader } from './js/base/ResourceLoader.js'

export class Main {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    const loader = ResourceLoader.create()
    loader
      .onloaded()
      .then((res) => {
        // console.log(res)
      })
      .catch((e) => {
        console.error('Promise Error: ' + e)
      })

    let image = new Image()
    image.src = './res/background.png'

    image.onload = () => {
      this.ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        // 使用图片的大小
        image.width,
        image.height
      )
    }
  }
}
