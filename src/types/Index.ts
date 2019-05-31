/**
 * 定义复杂类型
 */

import Birds from '@/modules/player/Birds';
import Score from '@/modules/player/Score';
import Painter from '@/interfaces/Painter';

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

/**
 * @type DataStoreSet 联合类型，set 到 Map 对象中时只能为以下几种类型
 * @typedef (new()=>Painter|Score) 实现 Painter 接口的构造器和 Score 类构造器
 * @typedef Painter[] painter 数组，主要存放铅笔对象
 */
export type DataStoreSet = (new () => Painter | Score) | Painter[];

/**
 * @type DataStoreGet 交叉类型，获取时包含所有值的对象与方法
 * @typedef Painter Painter 对象，包含 Background、Land 等对象
 * @typedef Score 未实现 Painter，所以要单独合并
 * @typedef Birds: Birds 对象，由于其成员变量更多，需要单独合并
 * @typedef Painter[]: 存放的铅笔对象
 */
export type DataStoreGet = Painter & Score & Birds & Painter[];
