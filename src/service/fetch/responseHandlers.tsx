/**
 * 响应处理方法
 * 此模块的目标是给fetch响应处理方法一定自由度,可组合,不互相污染
 */
import Toast from "react-native-tiny-toast";
import configStore from "../../store";
import { toggleLoginState, setToke, setUserInfo } from "../../actions/user";
import { clearLoginStatus } from '../../actions/user';
import { AnyAction } from "redux";
const { store } = configStore();

/**
 * 超时响应
 * @param result 
 */
export const timeoutHandler = (promise: any) => {
  return promise.then((result: any) => {
    // console.log(result, 'timeoutHandler')
    if (result && result.timeout) {
      Toast.show("连接超时", { position: 0 });
      return Promise.reject(result);
    }
    return Promise.resolve(result);
  })
}

/**
 * token过期
 * @param result 
 * @returns 
 */
export const authInvalidHandler = (promise: Promise<any>) => {
  return promise.then((result: any) => {
    if (result && result.code === '203' || result.code === '204') {
      Toast.show("用户信息过期，请重新登录", { position: 0 });

      store.dispatch(clearLoginStatus() as any)
      // store.dispatch(toggleLoginState(false));
      // store.dispatch(setToke(""));
      // store.dispatch(setUserInfo({}));
      return Promise.reject(result);
    }
    return Promise.resolve(result);
  })
}

/**
 * 剩余未知错误处理
 * @param result 
 * @param options 
 */
export const restErrorHandler = (promise: any) => {
  return promise.then((result: any) => {
    // console.log(result, 'dataHandler')
    if (result && result.code !== 200 && result.code !== '203' && result.code !== '204') {
      Toast.show(result.message, { position: 0 });
      return Promise.reject(result);
    }
    return Promise.resolve(result);
  })
}

/**
 * format返回数据
 * @param result 
 */
export const dataFormatHandler = (promise: any) => {
  return promise.then((result: any) => {
    // console.log(result, 'dataHandler')
    if (result && result.code === 200) {
      return Promise.resolve(result.data);
    }
    return Promise.resolve(result);
  })
}