/**
 * 计分器类
 */
import DataStore from '@/modules/base/DataStore';

export default class Score {
  private ctx: CanvasRenderingContext2D = DataStore.getInstance().ctx;
  public scoreNumber: number = 0;
  public isScore: boolean = true;

  public draw(): void {
    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = '#333';
    this.ctx.fillText(
      this.scoreNumber.toString(),
      window.innerWidth / 2,
      window.innerHeight / 22,
      1000,
    );
  }
}
