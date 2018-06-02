/**
 * 导演类，控制游戏的逻辑
 */
import { DataStore } from './base/DataStore.js'
import { UpPencil } from './runtime/UpPencil.js'
import { DownPencil } from './runtime/DownPencil.js'

export class Director {
  static getInstance() {
    if (!Director.instance) {
      Director.instance = new Director()
    }
    return Director.instance
  }

  constructor() {
    this.dataStore = DataStore.getInstance()
    this.moveSpeed = 2
  }

  createPencil() {
    const minTop = DataStore.getInstance().canvas.height / 8
    const maxTop = DataStore.getInstance().canvas.height / 2
    const top = minTop + Math.random() * (maxTop - minTop)
    this.dataStore.get('pencils').push(new UpPencil(top))
    this.dataStore.get('pencils').push(new DownPencil(top))
  }

  birdsEvent() {
    const birds = this.dataStore.get('birds')
    for (let i = 0; i < 3; i++) {
      birds.y[i] = birds.birdsY[i]
    }
    birds.time = 0
  }

  // 与铅笔的碰撞检测
  static isStrike(bird, pencil) {
    return !(bird.top > pencil.bottom ||
      bird.bottom < pencil.top ||
      bird.right < pencil.left ||
      bird.left > pencil.right)
  }

  // 检测碰撞，判断游戏是否结束
  checkGameOver() {
    const birds = this.dataStore.get('birds')
    const land = this.dataStore.get('land')
    const pencils = this.dataStore.get('pencils')
    const score = this.dataStore.get('score')

    const birdBorder = {
      top: birds.y[0],
      right: birds.birdsX[0] + birds.birdsWidth[0],
      bottom: birds.birdsY[0] + birds.birdsHeight[0],
      left: birds.birdsX[0]
    }

    for (let pencil of pencils) {
      const pencilBorder = {
        top: pencil.y,
        right: pencil.x + pencil.width,
        bottom: pencil.y + pencil.height,
        left: pencil.x
      }
      if (Director.isStrike(birdBorder, pencilBorder)) {
        console.log('撞到铅笔了')
        this.isGameOver = true
        return
      }
    }

    if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
      console.log('撞到地板了')
      this.isGameOver = true
      return
    }

    if (score.isScore && birds.birdsX[0] >= (pencils[0].x + pencils[0].width)) {
      // 结束加分
      score.isScore = false
      score.scoreNumber++
      wx.vibrateShort({
        success: function () {
          console.log('震动成功')
        }
      })
      // this.dataStore.isStory = false
      // if (score.scoreNumber === 5) {
      //   this.dataStore.canvas.classList.remove('canvas')
      // }
    }
  }

  run() {
    this.checkGameOver()
    if (!this.isGameOver) {
      // 绘制相关精灵
      this.dataStore.get('background').draw()

      const pencils = this.dataStore.get('pencils')
      // 销毁铅笔
      if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
        // 推出该组铅笔，该组包含了上下两根
        pencils.shift()
        pencils.shift()
        // 开启加分
        this.dataStore.get('score').isScore = true
      }
      // 不断创建铅笔
      if (pencils[0].x <= (DataStore.getInstance().canvas.width - pencils[0].width) / 2 && pencils.length === 2) {
        this.createPencil()
      }
      pencils.forEach(pencil => pencil.draw())

      this.dataStore.get('land').draw()

      this.dataStore.get('score').draw()

      this.dataStore.get('birds').draw()

      // if (this.dataStore.isStory) {
      //   this.dataStore.get('story').draw()
      // }
      //
      // if (this.dataStore.get('score').scoreNumber === 5) {
      //   this.dataStore.get('birds').drawOther()
      // }

      // 跑动动画
      const animationTimer = requestAnimationFrame(() => this.run())
      this.dataStore.put('animationTimer', animationTimer)
    } else {
      console.log('游戏结束')
      this.dataStore.get('startButton').draw()
      cancelAnimationFrame(this.dataStore.get('animationTimer'))
      this.dataStore.destroy()
      wx.triggerGC()
    }
  }
}
