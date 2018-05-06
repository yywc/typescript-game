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
    const minTop = window.innerHeight / 8
    const maxTop = window.innerHeight / 2
    const top = minTop + Math.random() * (maxTop - minTop)
    this.dataStore.get('pencils').push(new UpPencil(top))
    this.dataStore.get('pencils').push(new DownPencil(top))
  }

  run() {
    if (!this.dataStore.isGameOver) {
      // 绘制相关精灵
      this.dataStore.get('background').draw()

      const pencils = this.dataStore.get('pencils')
      // 销毁铅笔
      if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
        // 推出该组铅笔，该组包含了上下两根
        pencils.shift()
        pencils.shift()
      }
      // 不断创建铅笔
      if (pencils[0].x <= (window.innerWidth - pencils[0].width) / 2 && pencils.length === 2) {
        this.createPencil()
      }
      pencils.forEach((pencil) => {
        pencil.draw()
      })

      this.dataStore.get('land').draw()

      this.dataStore.get('birds').draw()

      // 跑动动画
      const animationTimer = requestAnimationFrame(() => {
        this.run()
      })
      this.dataStore.put('animationTimer', animationTimer)
    } else {
      cancelAnimationFrame(this.dataStore.get('animationTimer'))
    }
  }
}
