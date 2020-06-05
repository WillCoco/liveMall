import { STATUS_BAR_HEIGHT, SHOW_LIVE_TAB } from '../constants/Public'

/**
 * 获取状态栏高度
 * @param height 高度
 */
export const getStatusBarHeight = (height: number) => {
  return { type: STATUS_BAR_HEIGHT, payload: height }
}

/**
 * 设置直播标签状态
 */
export const setLiveTabStatus = (showFlag: number) => {
  return { type: SHOW_LIVE_TAB, payload: showFlag }
}