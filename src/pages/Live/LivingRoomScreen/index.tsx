/**
 * 直播页
 */
import * as React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import {useDispatch} from 'react-redux';
import LiveWindow from '../../../components/LiveWindow';
import withPage from '../../../components/HOCs/withPage';
import {EMPTY_OBJ} from '../../../constants/freeze';
import {MediaType} from '../../../liveTypes';
import {clearLiveRoom, updateRoomMessage} from '../../../actions/im';

interface LiveWindowParams {
  mediaType: MediaType, // 媒体类型
  liveId?: string | number, // 直播id
  groupID?: string, // im群组
}

const LivingRoomScreen = (props: any) : any =>  {
  const route = useRoute() || EMPTY_OBJ;

  // 屏幕常亮
  React.useEffect(() => {
    activateKeepAwake();
    // 清空消息
    dispatch(updateRoomMessage([]));

    dispatch(clearLiveRoom('AUDIENCE'));
    return () => {
      deactivateKeepAwake();
    }
  }, [])

  const dispatch = useDispatch();

  const {
    mediaType,
  } : LiveWindowParams = (route.params || EMPTY_OBJ) as LiveWindowParams;

  // 直播
  if (mediaType === MediaType.living) {
    return (
      <LiveWindow.Audience
        safeTop={props.safeTop}
      />
    )
  }

  // 预告
  if (mediaType === MediaType.teaser) {
    return (
      <LiveWindow.AudienceTeaser
        safeTop={props.safeTop}
      />
    )
  }

  // 回放
  return (
    <LiveWindow.AudienceRecord
      safeTop={props.safeTop}
    />
  )
};

LivingRoomScreen.defaultProps = {
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default withPage(LivingRoomScreen, {
  statusBarOptions: {
  }
});