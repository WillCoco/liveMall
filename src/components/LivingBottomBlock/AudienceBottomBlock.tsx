/**
 * 直播间底部bock业务组件
 */
import * as React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import LiveMsg from '../LiveMsg';
import {Audience as AudienceLiveToolBar} from '../LiveToolBar';
import {pad} from '../../constants/Layout';
import {vh} from '../../utils/metric';

const LivingRoomScreen = (props) : any =>  {
  /**
   * 测试聊天
   */
  const initData: any[] = ['等级- 用户: 测试消息'];
  const [data, setData] = React.useState(initData);
  React.useEffect(() => {
    const add = () => {
      const newData = [...data, '等级- 用户: 测试消息']
      setData(newData);
    }

    const timer = setInterval(() => {
      add()
    }, 3000)

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [data])

  // 观众
  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      <LiveMsg
        msgList={data}
        // style={{maxHeight: 200, width: 200}}
      />
      <AudienceLiveToolBar />
    </View>
  )
};

LivingRoomScreen.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: pad,
    justifyContent: 'flex-end',
  },
});

export default LivingRoomScreen;