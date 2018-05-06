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

  onloaded() {
    let pr = []
    for (let img of this.map.values()) {
      let p = new Promise((resolve, reject) => {
        img.onload = () => {
          resolve(this.map)
        }
        img.onerror = () => {
          reject(new Error('Could not load image '))
        }
      })
      pr.push(p)
    }
    // 图片全部加载完
    return Promise.all(pr)
  }

  static create() {
    return new ResourceLoader()
  }
}
