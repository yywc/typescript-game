/**
 * 初始化整个游戏的精灵，作为游戏开始的入口
 */
import { ResourceLoader } from './js/base/ResourceLoader.js'

export class Main {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    const loader = ResourceLoader.create()
    loader.onloaded((map) => {
      this.onResourceFirstLoaded(map)
    })
  }

  onResourceFirstLoaded(map) {
    console.log(map)
  }
}
