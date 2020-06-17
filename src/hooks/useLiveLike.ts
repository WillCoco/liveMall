/**
 * 直播喜欢
 *  
 */
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Poller from '../utils/poller';
import { apiLiveLike } from '../service/api';
import { isSucceed } from '../utils/fetchTools';
import { updateLivingInfo } from '../actions/live';

const GET_INTERVAL = 1000 * 30;

export default function useLiveLike(liveId: number | string) {
  const likeSum = useSelector((state: any) => state?.live?.liveInfo);

  const dispatch = useDispatch();

  // getLikeSum
  const getLikeSum = () => {
    const params = {
      liveId,
      likeNum: 0
    }
    apiLiveLike(params)
      .then((res: any) => {
        if (isSucceed(res)) {
          if (res?.data) {
            dispatch(updateLivingInfo({likeSum: res?.data}))
          }
        }
      })
      .catch((error: any) => {
        console.log(`apiLiveLike: `, error)
      })
  };

  /**
   * 轮询器
   */
  const poller = React.useRef(new Poller({
    interval: GET_INTERVAL,
    initExec: true,
    callback: getLikeSum
  }));

  /**
   * 开始轮询获取
   */
  const start = () => {
    if (poller.current) {
      poller.current.start();
    }
  }

  /**
   * 停止轮询获取
   */
  const stop = () => {
    if (poller.current) {
      poller.current.stop();
    }
  }

  /**
   * liveId更新
   */
  React.useEffect(() => {
    // 先关闭·
    if (poller.current) {
      poller.current.stop();
    };

    // 重新赋值
    poller.current = new Poller({
      interval: GET_INTERVAL,
      initExec: true,
      callback: getLikeSum
    });

    // 开始轮询
    poller.current.start();
  }, [liveId])

  /**
   * 自动开始、自动停止
   */
  React.useEffect(() => {
    if (poller.current) {
      poller.current.start();
    };

    return () => {
      // 开始轮询
      poller.current.stop();
    }
  }, [])

  return {
    likeSum,
    start,
    stop
  }
}
