import Pencil from '@/modules/runtime/Pencil';
import Sprite from '@/modules/base/Sprite';

export default class PencilUp extends Pencil {
  public constructor(top: number) {
    super(Sprite.getImage('pencilUp'), top);
  }

  public draw(): void {
    this.dy = this.top - this.dHeight; // top 值 - 图片值，其实结果就是图片往上偏移的值
    super.draw();
  }
}
