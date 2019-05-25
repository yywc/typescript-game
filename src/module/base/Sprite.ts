/**
 * 精灵的基类，负责初始化精灵加载的资源和大小以及位置
 * todo ctx, img getImage返回值 类型确定
 */
import DataStore from './DataStore';
/**
 * @param ctx CanvasRenderingContext2D对象
 * @param img 传入Image对象
 * @param srcX 要剪裁的起始X坐标
 * @param srcY 要剪裁的起始Y坐标
 * @param srcW 剪裁的宽度
 * @param srcH 剪裁的高度
 * @param x 放置的x坐标
 * @param y 放置的y坐标
 * @param width 要使用的宽度
 * @param height 要使用的高度
 */
interface SpritConfig {
  ctx?: CanvasRenderingContext2D;
  img: HTMLImageElement;
  srcX: number;
  srcY: number;
  srcW: number;
  srcH: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Sprite implements SpritConfig {
  public ctx: CanvasRenderingContext2D;
  public img: HTMLImageElement;
  public srcX: number;
  public srcY: number;
  public srcW: number;
  public srcH: number;
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public constructor(
    img = null as HTMLImageElement,
    srcX = 0,
    srcY = 0,
    srcW = 0,
    srcH = 0,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
  ) {
    this.ctx = DataStore.getInstance().ctx;
    this.img = img;
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcW = srcW;
    this.srcH = srcH;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * 在子类 super 上获取 image
   * @param key
   * @returns {*}
   */
  public static getImage(key: string): HTMLImageElement {
    return DataStore.getInstance().res.get(key);
  }

  public draw(
    img = this.img,
    srcX = this.srcX,
    srcY = this.srcY,
    srcW = this.srcW,
    srcH = this.srcH,
    x = this.x,
    y = this.y,
    width = this.width,
    height = this.height,
  ): void {
    this.ctx.drawImage(
      img,
      srcX,
      srcY,
      srcW,
      srcH,
      x,
      y,
      width,
      height,
    );
  }
}
