import { STATUS_BAR_HEIGHT, IS_LOGIN, SHOW_LIVE_TAB } from '../constants/Public'

const INITIAL_STATE = {
  statusBarHeight: 0,
  isLogin: false,
  showLiveTab: 0
}

export default function publicData(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case STATUS_BAR_HEIGHT:
      return {
        ...state,
        statusBarHeight: action.payload
      }
    case IS_LOGIN:
      return {
        ...state,
        isLogin: action.payload
      }
    case SHOW_LIVE_TAB:
      return {
        ...state,
        showLiveTab: action.payload
      }
    default:
      return state
  }
}