/**
 * 资源文件加载器，确保canvas在图片资源加载完成后才进行渲染
 */
import { Resources } from './Resources.js'

export class ResourceLoader {
  constructor() {
    this.map = new Map(Resources)
    for (let [key, value] of this.map) {
      const img = new Image()
      img.src = value
      this.map.set(key, img)
    }
  }

  onloaded(fn) {
    let loadCount = 0
    for (let img of this.map.values()) {
      img.onload = () => {
        loadCount++
        if (loadCount >= this.map.size) {
          fn(this.map)
        }
      }
    }
  }

  static create() {
    return new ResourceLoader()
  }
}
