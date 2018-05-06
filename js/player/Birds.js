/**
 * 小鸟类
 * 循环渲染三只小鸟，其实是循环渲染图片的三个部分
 */
import { Sprite } from '../base/Sprite.js'

export class Birds extends Sprite {
  constructor() {
    const image = Sprite.getImage('birds')
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      image.width,
      image.height
    )

    // 小鸟的三种状态用数组去存储
    // 小鸟宽 34，高 24，上下边距 10，左右边距 9
    this.clippingX = [
      9,
      9 + 34 + 18,
      9 + 34 + 18 + 34 + 18
    ]
    this.clippingY = [10, 10, 10]
    this.birdWidth = 34
    this.birdHeight = 34
    this.clippingWidth = [this.birdWidth, this.birdWidth, this.birdWidth]
    this.clippingHeight = [this.birdHeight, this.birdHeight, this.birdHeight]
    this.birdsWidth = [this.birdWidth, this.birdWidth, this.birdWidth]
    this.birdsHeight = [this.birdHeight, this.birdHeight, this.birdHeight]
    this.birdX = window.innerWidth / 4
    this.birdsX = [this.birdX, this.birdX, this.birdX]
    this.birdY = window.innerHeight / 2
    this.birdsY = [this.birdY, this.birdY, this.birdY]
    // 小鸟 y 坐标
    this.y = [this.birdY, this.birdY, this.birdY]
    // 小鸟下落时间
    this.time = 0
    // 判断小鸟是第几只
    this.index = 0
    // 循环小鸟个数
    this.count = 0
  }

  draw() {
    // 0.1 是切换小鸟的速度
    this.count += 0.1
    if (this.count > 3) {
      this.count = 0
    }
    // 由于浏览器默认一秒钟刷新 60 次，小鸟会出现快速切换，体验不好
    // 采取了小数又会导致绘制不出来出现闪烁，取四舍五入，达到一个减速器的作用
    this.index = Math.floor(this.count)

    // 让小鸟掉下去
    const g = 0.98 / 2.4
    // 向上偏移一点点
    const offsetUp = 20
    const offsetY = (g * this.time * (this.time - offsetUp)) / 2

    for (let i = 0; i < 3; i++) {
      this.birdsY[i] = this.y[i] + offsetY
    }
    this.time++

    super.draw(
      this.img,
      this.clippingX[this.index],
      this.clippingY[this.index],
      this.clippingWidth[this.index],
      this.clippingHeight[this.index],
      this.birdsX[this.index],
      this.birdsY[this.index],
      this.birdsWidth[this.index],
      this.birdsHeight[this.index]
    )
  }
}
