/**
 * @author: Xu Ke
 * @date: 2019/9/21 4:13 AM
 * @Description:
 * @lastModificationBy:
 * @lastModification:
 * @lastModificationDate:
 */
import React from "react";
import Poller from "../../utils/poller";
import { SmallText } from 'react-native-normalization-text';
import {
  View,
  StyleSheet,
} from 'react-native';

interface CountDownProps {
  renderTime: (second: number) => any, // 展示render方法
  interval: number,                    // 频率
  onStop: () => void,                  // 倒计时结束后回调
  deadline: number,                    // 终点时间戳
  timeOffset?: number,  
}

const CountDown = (props: CountDownProps) =>  {
  /**
   * 剩余时间
   */
  const [remainTime,  setRemainTime] = React.useState(0);

  const countDown = () => {
    const {deadline, timeOffset} = props;
    if (!deadline) {
      return;
    }

    const deadlineFixed = deadline + (timeOffset || 0); // 矫正后时间

    const remain = Math.round((deadlineFixed - Date.now()) / 1000);

    if (remain <= 0) {
      timer.current.stop();
      props.onStop && props.onStop();
    }

    setRemainTime(() => remain);
  };

  /**
   * 轮询器 
   * 这里不接受改变props.deadline
   */
  const timer = React.useRef(new Poller({
    interval: props.interval,
    callback: countDown
  }))

  React.useEffect(() => {
    timer.current.start();
    console.log(props.deadline, 'props.deadline')

    return () => {
      console.log(props.deadline, 'props.deadline')
      timer.current.stop();
    }
  }, [props.deadline]);

  return props.renderTime(remainTime < 0 ? 0 : remainTime);
};

CountDown.defaultProps = {
  renderTime: (second: number) => (<SmallText>{second}</SmallText>), // 展示render方法
  interval: 1000,                                  // 频率
  onStop: () => undefined,                            // 倒计时结束后回调
  deadline: 0,                                     // 终点时间戳
  timeOffset: undefined,  
};

export default CountDown;

