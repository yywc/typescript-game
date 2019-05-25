/**
 * 计分器类
 */
import DataStore from '@/module/base/DataStore';

export default class Score {
  public ctx: CanvasRenderingContext2D;
  public scoreNumber: number;
  public isScore: boolean;

  public constructor() {
    this.ctx = DataStore.getInstance().ctx;
    this.scoreNumber = 0;
    this.isScore = true;
  }

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
