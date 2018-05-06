/**
 * 初始化整个游戏的精灵，作为游戏开始的入口
 */
import { ResourceLoader } from './js/base/ResourceLoader.js'
import { BackGround } from './js/runtime/BackGround.js'
import { Director } from './js/Director.js'
import { DataStore } from './js/base/DataStore.js'
import { Land } from './js/runtime/Land.js'

export class Main {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.dataStore = DataStore.getInstance()
    const loader = ResourceLoader.create()
    loader
      .onloaded()
      .then((res) => {
        this.onResourceFirstLoaded(res[0])
      })
      .catch((e) => {
        console.error('Promise Error: ' + e)
      })
  }

  onResourceFirstLoaded(map) {
    // 给 dataStore 赋值，这些不需要重新生成的
    this.dataStore.ctx = this.ctx
    this.dataStore.res = map
    this.init()
  }

  init() {
    this.dataStore
      .put('background', BackGround)
      .put('land', Land)
    // run 方法绘制图像
    Director.getInstance().run()
  }
}
