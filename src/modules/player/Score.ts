/**
 * 计分器类
 */
import DataStore from '@/modules/base/DataStore';

export default class Score {
  // 从 dataStore 获取 canvas 下的 2D 对象
  private ctx: CanvasRenderingContext2D = DataStore.getInstance().ctx;
  public scoreNumber: number = 0; // 分数
  public isScore: boolean = true; // 是否加分，防止过速渲染加分

  public draw(): void {
    this.ctx.font = '25px Arial'; // 定义绘制文字的字体、大小
    this.ctx.fillStyle = '#333'; // 定义绘制文字的颜色
    // 参考 fillText 方法
    this.ctx.fillText(
      this.scoreNumber.toString(),
      window.innerWidth / 2,
      window.innerHeight / 22,
      1000
    );
  }
}
