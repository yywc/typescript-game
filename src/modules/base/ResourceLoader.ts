import resource from './Resource';

/**
 * 资源加载器
 */
export default class ResourceLoader {
  private static instance: ResourceLoader;
  // 存储所有的图片
  private readonly map: Map<string, HTMLImageElement> = new Map();

  private constructor() {
    const imageMap = new Map(resource);
    let img: HTMLImageElement;

    imageMap.forEach(
      (value, key): void => {
        img = new Image();
        img.src = value;
        this.map.set(key, img); // 设置图片对象
      }
    );
  }

  public static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }

  /**
   * pr 是包含 6 个 Map 对象的 Promise 数组
   * 图片 onload 异步进行，通过 Promise.all 拿到所有 onload 完成后的数据
   * 我们使用到的就是数组里任意一个就可以
   */
  public onLoad(): Promise<Map<string, HTMLImageElement>[]> {
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
    // 让图片全都加载完成
    return Promise.all(pr);
  }
}
