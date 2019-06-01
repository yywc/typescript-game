/**
 * @interface Painter canvas 画图接口
 * @param image 传入Image对象
 * @param sx 要剪裁的起始X坐标
 * @param sy 要剪裁的起始Y坐标
 * @param sWidth 剪裁的宽度
 * @param sHeight 剪裁的高度
 * @param dx 放置的x坐标
 * @param dy 放置的y坐标
 * @param dWidth 要使用的宽度
 * @param dHeight 要使用的高度
 * @function draw CanvasRenderingContext2D.drawImage()
 */
export default interface Painter {
  image: HTMLImageElement;
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;

  // 设置为可选是因为在实现的时候解构赋值了默认值
  draw(
    image?: HTMLImageElement,
    sx?: number,
    sy?: number,
    sWidth?: number,
    sHeight?: number,
    dx?: number,
    dy?: number,
    dWidth?: number,
    dHeight?: number
  ): void;
}
