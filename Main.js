/**
 * 初始化整个游戏的精灵，作为游戏开始的入口
 */
import { ResourceLoader } from './js/base/ResourceLoader.js'
import { BackGround } from './js/runtime/BackGround.js'
import { Director } from './js/Director.js'
import { DataStore } from './js/base/DataStore.js'
import { Land } from './js/runtime/Land.js'
import { Birds } from './js/player/Birds.js'
import { StartButton } from './js/player/StartButton.js'
import { Score } from './js/player/Score.js'

export class Main {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.dataStore = DataStore.getInstance()
    this.director = Director.getInstance()

    const loader = ResourceLoader.create()
    loader
      .onloaded()
      .then(res => this.onResourceFirstLoaded(res[0]))
      .catch(e => console.error('Promise Error: ' + e))
  }

  onResourceFirstLoaded(map) {
    // 给 dataStore 赋值，这些不需要重新生成的
    this.dataStore.ctx = this.ctx
    this.dataStore.res = map
    this.init()
  }

  init() {
    // 控制游戏是否结束
    this.director.isGameOver = false
    this.dataStore
      .put('background', BackGround)
      .put('land', Land)
      .put('pencils', [])
      .put('birds', Birds)
      .put('startButton', StartButton)
      .put('score', Score)
    this.registerEvent()
    // 在游戏开始前创建第一组铅笔
    this.director.createPencil()
    // run 方法绘制图像
    this.director.run()
  }

  registerEvent() {
    this.canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      if (this.director.isGameOver) {
        console.log('游戏开始')
        this.init()
      } else {
        this.director.birdsEvent()
      }
    })
  }
}
