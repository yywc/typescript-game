/**
 * 导演类，控制游戏的逻辑
 */
import { DataStore } from './base/DataStore.js'

export class Director {
  static getInstance() {
    if (!Director.instance) {
      Director.instance = new Director()
    }
    return Director.instance
  }

  constructor() {
    this.DataStore = DataStore.getInstance()
  }

  run() {
    const backgroundSprite = this.DataStore.get('background')
    backgroundSprite.draw()
  }
}
