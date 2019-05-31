/**
 * @interface BirdsProperty 小鸟计算属性接口
 * @param clippingXList
 * @param clippingYList
 * @param clippingWidthList
 * @param clippingHeightList
 * @param birdsWidthList
 * @param birdsHeightList
 * @param birdsXList
 * @param birdsYList
 * @param originYList 小鸟 y 坐标
 * @param time 小鸟下落时间
 * @param index 小鸟是第几只的索引
 * @param count 循环小鸟个数
 */

export default interface BirdsProperty {
  clippingXList: number[];
  clippingYList: number[];
  clippingWidthList: number[];
  clippingHeightList: number[];
  birdsWidthList: number[];
  birdsHeightList: number[];
  birdsXList: number[];
  birdsYList: number[];
  originYList: number[];
  time: number;
  index: number;
  count: number;
}
