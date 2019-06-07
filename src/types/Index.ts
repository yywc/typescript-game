import Painter from '@/interfaces/Painter';

/**
 * 定义复杂类型
 */

/**
 * @type DataStoreSet 联合类型（之后会有更多类型，先这样定义出来）
 * @typedef (new()=>Painter) 实现 Painter 接口的构造器
 * @typedef Painter[][] painter 数组，主要存放铅笔对象，上下为一组
 */
export type DataStoreSet = (new () => Painter) | Painter[][];

/**
 * @type DataStoreGet 交叉类型（之后会有更多类型，先这样定义出来），获取时包含所有值的对象与方法
 * @typedef Painter Painter 对象，包含 Background、land 等资源对象
 * @typedef Painter[][] 存放的铅笔对象，上下铅笔为一组
 */
export type DataStoreGet = Painter & Painter[][];
