/**
 * 资源文件加载器，确保canvas在图片资源加载完成后才进行渲染
 */
import Resources from './Resources';

export default class ResourceLoader {
  public map: Map<string, HTMLImageElement> = new Map();

  public constructor() {
    let img: HTMLImageElement;
    const imageStringMap: Map<string, string> = new Map(Resources);

    imageStringMap.forEach((value: string, key: string): void => {
      img = new Image();
      img.src = value;
      this.map.set(key, img);
    });
  }

  public static create(): ResourceLoader {
    return new ResourceLoader();
  }

  public onLoaded(): Promise<Map<string, HTMLImageElement>[]> {
    const pr: Promise<Map<string, HTMLImageElement>>[] = [];
    let p: Promise<Map<string, HTMLImageElement>>;

    this.map.forEach((img: HTMLImageElement): void => {
      p = new Promise((resolve, reject): void => {
        /* eslint-disable no-param-reassign */
        img.onload = (): void => resolve(this.map);
        img.onerror = (): void => reject(new Error('Could not load image '));
      });
      pr.push(p);
    });
    // 图片全部加载完
    return Promise.all(pr);
  }
}
