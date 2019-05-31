/**
 * 精灵的基类，负责初始化精灵加载的资源和大小以及位置
 */
import DataStore from './DataStore';
import Painter from '@/interfaces/Painter';

export default class Sprite implements Painter {
  public ctx: CanvasRenderingContext2D;
  public image: HTMLImageElement;
  public sx: number;
  public sy: number;
  public sWidth: number;
  public sHeight: number;
  public dx: number;
  public dy: number;
  public dWidth: number;
  public dHeight: number;

  public static getImage(key: string): HTMLImageElement {
    return DataStore.getInstance().res.get(key) as HTMLImageElement;
  }

  public constructor(
    image = new Image(),
    sx = 0,
    sy = 0,
    sWidth = 0,
    sHeight = 0,
    dx = 0,
    dy = 0,
    dWidth = 0,
    dHeight = 0,
  ) {
    this.ctx = DataStore.getInstance().ctx;
    this.image = image;
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
    this.dx = dx;
    this.dy = dy;
    this.dWidth = dWidth;
    this.dHeight = dHeight;
  }

  public draw(
    image = this.image,
    sx = this.sx,
    sy = this.sy,
    sWidth = this.sWidth,
    sHeight = this.sHeight,
    dx = this.dx,
    dy = this.dy,
    dWidth = this.dWidth,
    dHeight = this.dHeight,
  ): void {
    this.ctx.drawImage(
      image,
      sx,
      sy,
      sWidth,
      sHeight,
      dx,
      dy,
      dWidth,
      dHeight,
    );
  }
}
