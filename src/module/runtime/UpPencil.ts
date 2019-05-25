/**
 * 上半部分铅笔
 */
import Pencil from './Pencil';
import Sprite from '@/module/base/Sprite';

export default class UpPencil extends Pencil {
  public constructor(top: number) {
    const image: HTMLImageElement = Sprite.getImage('pencilUp');
    super(image, top);
  }

  public draw(): void {
    this.y = this.top - this.height;
    super.draw();
  }
}
