import Painter from '@/interfaces/Painter';
import Birds from '@/modules/player/Birds';
import Score from '@/modules/player/Score';

/**
 * 定义复杂类型
 */

/**
 * @type DataStoreSet 联合类型（之后会有更多类型，先这样定义出来）
 * @typedef (new()=>Painter|Score) 实现 Painter 接口的构造器和 Score 类构造器
 * @typedef Painter[][] painter 数组，主要存放铅笔对象，上下为一组
 * @typedef Score 积分对象
 */
export type DataStoreSet = (new () => Painter | Score) | Painter[][];

/**
 * @type DataStoreGet 交叉类型（之后会有更多类型，先这样定义出来），获取时包含所有值的对象与方法
 * @typedef Painter Painter 对象，包含 Background、Land 等资源对象
 * @typedef Score 未实现 Painter，所以要单独合并
 * @typedef Painter[][] 存放的铅笔对象，上下铅笔为一组
 * @typedef Score 积分对象
 */
export type DataStoreGet = Painter & Painter[][] & Birds & Score;

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
