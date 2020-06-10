/**
 * 重连
 */
import React from 'react';
import useNetInfo from "./useNetInfo";
import {sleep} from "../utils/tools";

export default function useResume(resume: (state?: any) => undefined | boolean, isStopResume?: boolean) {
  const [onNetChange, setOnNetChange]: any = React.useState();
  
  const {netInfo, getNetInfo} = useNetInfo(onNetChange);

  // 网络切换回调
  const onNetChangeFun = (state: any) => {
    const result = resume(state);
    // 重启成功后需要关闭resume
    if (result) {
      setOnNetChange();
    }
  }

  const retry = async () => {
    const netInfo = await getNetInfo();
    if (netInfo?.type) {
      // 当前有网, 立即重试
      await sleep(500);
      resume();

      
    } else {
      // 当前无网, 有网了再试
      setOnNetChange(onNetChangeFun);
    }
  }
  
  return {
    retry
  };
}
