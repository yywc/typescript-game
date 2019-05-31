/**
 * 小鸟类，循环渲染三只小鸟
 */
import Sprite from '@/module/base/Sprite';
import DataStore from '@/module/base/DataStore';
import BirdsProperty from '@/interfaces/BirdsProperty';

export default class Birds extends Sprite implements BirdsProperty {
  public readonly clippingXList: number[];
  public readonly clippingYList: number[];
  public readonly clippingWidthList: number[];
  public readonly clippingHeightList: number[];
  public readonly birdsWidthList: number[];
  public readonly birdsHeightList: number[];
  public readonly birdsXList: number[];
  public readonly birdsYList: number[];
  public readonly originYList: number[];
  public time: number;
  public index: number;
  public count: number;

  public constructor() {
    const image = Sprite.getImage('birds');
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
    );

    this.ctx = DataStore.getInstance().ctx;
    // 小鸟的三种状态用数组去存储
    const birdWidth = 34;
    const birdHeight = 24;
    const birdX = window.innerWidth / 4;
    const birdY = window.innerHeight / 2;
    // 小鸟宽 34，高 24，上下边距 10，左右边距 9
    this.clippingXList = [
      9,
      9 + 34 + 18,
      9 + 34 + 18 + 34 + 18,
    ];
    this.clippingYList = [10, 10, 10];
    this.clippingWidthList = [birdWidth, birdWidth, birdWidth];
    this.clippingHeightList = [birdHeight, birdHeight, birdHeight];
    this.birdsWidthList = [birdWidth, birdWidth, birdWidth];
    this.birdsHeightList = [birdHeight, birdHeight, birdHeight];
    this.birdsXList = [birdX, birdX, birdX];
    this.birdsYList = [birdY, birdY, birdY];
    this.originYList = [birdY, birdY, birdY]; // 小鸟 y 坐标
    this.time = 0; // 小鸟下落时间
    this.index = 0; // 判断小鸟是第几只
    this.count = 0; // 循环小鸟个数
  }

  public draw(): void {
    // 0.1 是切换小鸟的速度
    this.count += 0.1;
    if (this.count > 3) {
      this.count = 0;
    }
    // 由于浏览器默认一秒钟刷新 60 次，小鸟会出现快速切换，体验不好
    // 采取了小数又会导致绘制不出来出现闪烁，取四舍五入，达到一个减速器的作用
    this.index = Math.floor(this.count);

    // 让小鸟掉下去
    const g = 0.98 / 2.4;
    // 向上偏移一点点
    const offsetUp = 20;
    const offsetY = (g * this.time * (this.time - offsetUp)) / 2;

    for (let i = 0; i < 3; i += 1) {
      this.birdsYList[i] = this.originYList[i] + offsetY;
    }
    this.time += 1;

    super.draw(
      this.image,
      this.clippingXList[this.index],
      this.clippingYList[this.index],
      this.clippingWidthList[this.index],
      this.clippingHeightList[this.index],
      this.birdsXList[this.index],
      this.birdsYList[this.index],
      this.birdsWidthList[this.index],
      this.birdsHeightList[this.index],
    );
  }
}
