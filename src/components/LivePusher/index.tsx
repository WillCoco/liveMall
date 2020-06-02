/**
 * 推流组件
 */
import React from 'react';
import {
  View,
  ScrollView,
  PermissionsAndroid,
  StyleSheet,
  StyleProp,
  InteractionManager
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
// import {Streaming} from 'pili-streaming-react-native';
import {NodePlayerView, NodeCameraView} from 'react-native-nodemediaclient';
import {PrimaryText} from 'react-native-normalization-text';
import {vw, vh} from '../../utils/metric';
import { isAndroid, safeTop } from '../../constants/DeviceInfo';
import {updateStarted} from '../../actions/live';
import usePermissions from '../../hooks/usePermissions';

interface LivePusherProps {
  style?: StyleProp<any>,
}

const LivePusher = React.forwardRef((props: LivePusherProps, ref: any) : any =>  {
  const dispatch = useDispatch();

  /**
   * 实例
   */
  const pusher: {current: any} = React.useRef();

  /**
   * 必要权限
   */
  const isPermissionGranted = usePermissions([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);

  React.useEffect(() => {
    // 打开
    return () => {
      // 关闭
      // Toast.show('close')
      // return dispatch(updateStarted(false))
      pusher.current && pusher.current.stopPreview();
    }
  }, [])


  /**
   * 推流配置
   */
  const pusherConfig = useSelector((state: any) => state?.live?.pusherConfig)

  /**
   * 直播间信息
   */
  const pushUrl = useSelector((state: any) => state?.live?.livingInfo?.pushUrl)

  /**
   * 加载推流的条件
   */
  const showPusher = isPermissionGranted && pushUrl;


  console.log(isPermissionGranted, 'b01_isPermissionGranted')
  console.log(pusherConfig, 'b01_pusherConfig')
  console.log(pushUrl, 'b01_pushUrl')
  console.log(showPusher, 'b01_showPushershowPusher')

  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      {
        showPusher ? (
          <NodeCameraView
            style={{width: '100%', height: '100%'}}
            ref={(c: any) => {
              pusher.current = c;
              ref(c);
            }}
            {...pusherConfig}
            outputUrl={pushUrl}
          />
        ) : null
      }
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
  },
  scrollerWrapper: {
  },
  contentWrapper: {
    justifyContent: 'flex-end',
  },
  loading: {
    position: 'absolute',
    top: vh(50) - 20,
    left: vw(50) - 20,
  }
})

export default LivePusher;