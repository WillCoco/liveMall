/**
 * 重试
 */
import { isSucceed } from '../../utils/fetchTools';
import { EMPTY_OBJ } from '../../constants/freeze';
import { sleep } from '../../utils/tools';


const retry = (fun: any, options = EMPTY_OBJ) => {
  // 默认配置
  const defaultOptions = {
    // 重试条件
    getShouldRetry: (result: any) => {
      return !isSucceed(result);
    },
    // 重试次数
    retryTimes: 5,
    // 重试间隔
    retryInterval: 1000
  };

  const opts = {...defaultOptions, ...options}
  let restTimes = opts.retryTimes;

  return async function funRetry (params?: any): Promise<any> {
    while(restTimes >= 0) {
      const result = await fun.call(null, params);
      restTimes--;

      const shouldRetry = opts.getShouldRetry(result);

      if (!shouldRetry) {
        return result;
      }
  
      if (restTimes <= 0) {
        return result;
      }

      await sleep(opts.retryInterval);
    };
  }
};

export default retry;