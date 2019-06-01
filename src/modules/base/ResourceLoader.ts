/**
 * 资源文件加载器，确保 canvas 在图片资源加载完成后才进行渲染
 */
import Resources from './Resources';

export default class ResourceLoader {
  private static instance: ResourceLoader;
  private readonly map: Map<string, HTMLImageElement> = new Map();

  public constructor() {
    const imageStringMap = new Map(Resources);
    let img: HTMLImageElement;

    imageStringMap.forEach(
      (value: string, key: string): void => {
        img = new Image();
        img.src = value;
        this.map.set(key, img);
      }
    );
  }

  public static getInstance(): ResourceLoader {
    if (ResourceLoader.instance) {
      return ResourceLoader.instance;
    }
    return new ResourceLoader();
  }

  public onLoaded(): Promise<Map<string, HTMLImageElement>[]> {
    type PromiseMap = Promise<Map<string, HTMLImageElement>>;
    const pr: PromiseMap[] = [];
    let p: PromiseMap;

    this.map.forEach(
      (img): void => {
        p = new Promise(
          (resolve, reject): void => {
            img.onload = (): void => resolve(this.map);
            img.onerror = (): void => reject(new Error('Could not load image '));
          }
        );
        pr.push(p);
      }
    );
    // 图片全部加载完
    return Promise.all(pr);
  }
}
