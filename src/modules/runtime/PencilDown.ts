import Pencil from '@/modules/runtime/Pencil';
import Sprite from '@/modules/base/Sprite';

export default class PencilDown extends Pencil {
  public constructor(top: number) {
    super(Sprite.getImage('pencilDown'), top);
  }

  public draw(): void {
    // gap 值，屏幕高度的一部分，根据自己喜好调整，值越大游戏越容易
    const gapBetweenTwoPencils = window.innerHeight / 8;
    // 最终下铅笔（我们可以看到）的高度，top 的值加上 gap 值
    this.dy = this.top + gapBetweenTwoPencils;
    super.draw();
  }
}
