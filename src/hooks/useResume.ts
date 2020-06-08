/**
 * 重连
 */
import React from 'react';
import useNetInfo from "./useNetInfo";
import {sleep} from "../utils/tools";

export default function useResume(resume: (state?: any) => any) {
  const [onNetChange, setOnNetChange] = React.useState();
  
  const {netInfo, getNetInfo} = useNetInfo(onNetChange);

  const retry = async () => {
    const netInfo = await getNetInfo();
    if (netInfo?.type) {
      // 当前有网, 立即重试
      await sleep(500);
      resume();
    } else {
      // 当前无网, 有网了再试
    }
  }
  
  return {
  };
}
