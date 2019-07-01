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
