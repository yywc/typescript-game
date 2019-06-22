import Painter from '@/interfaces/Painter';
import Birds from '@/modules/player/Birds';

/**
 * 定义复杂类型
 */

/**
 * @type DataStoreSet 联合类型（之后会有更多类型，先这样定义出来）
 * @typedef (new()=>Painter) 实现 Painter 接口的构造器
 * @typedef Painter[][] painter 数组，主要存放铅笔对象，上下为一组
 * @typedef Birds 设置进小鸟对象
 */
export type DataStoreSet = (new () => Painter) | Painter[][] | Birds;

/**
 * @type DataStoreGet 交叉类型（之后会有更多类型，先这样定义出来），获取时包含所有值的对象与方法
 * @typedef Painter Painter 对象，包含 Background、land 等资源对象
 * @typedef Painter[][] 存放的铅笔对象，上下铅笔为一组
 * @typedef Birds 存放小鸟对象
 */
export type DataStoreGet = Painter & Painter[][] & Birds;

/**
 * @interface BorderOffset
 * @param top 碰撞检测对象顶部，距离窗口顶部的距离
 * @param right 碰撞检测对象右侧，距离窗口左侧的距离
 * @param bottom 碰撞检测对象底部，距离窗口顶部的距离
 * @param left 碰撞检测对象左侧，距离窗口左侧的距离
 */
export interface BorderOffset {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
