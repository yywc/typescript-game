/**
 * 上半部分铅笔
 */
import Pencil from './Pencil';
import Sprite from '@/modules/base/Sprite';

export default class UpPencil extends Pencil {
  public constructor(top: number) {
    super(Sprite.getImage('pencilUp'), top);
  }

  public draw(): void {
    this.dy = this.top - this.dHeight;
    super.draw();
  }
}
