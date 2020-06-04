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
  InteractionManager,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
// import {Streaming} from 'pili-streaming-react-native';
// import {NodePlayerView, NodeCameraView} from 'react-native-nodemediaclient';
import {PrimaryText} from 'react-native-normalization-text';
import {vw, vh} from '../../utils/metric';
// import { isAndroid, safeTop } from '../../constants/DeviceInfo';
// import {updateStarted} from '../../actions/live';
import usePermissions from '../../hooks/usePermissions';
import defaultImages from '../../assets/default-image';
import {consts, Streaming} from 'pili-streaming-react-native';

interface LivePusherProps {
  style?: StyleProp<any>,
  onStateChange?: (v: any) => any,
  setResume: (v: boolean) => any
  resume: boolean
}

const LivePusher = React.forwardRef((props: LivePusherProps, ref: any): any => {
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

  /**
   * 推流配置
   */
  const pusherConfig = useSelector((state: any) => state?.live?.pusherConfig);

  /**
   * 直播间信息
   */
  const pushUrl = useSelector((state: any) => state?.live?.livingInfo?.pushUrl);

  const cover = useSelector((state: any) => {
    const smallPic = state?.live?.livingInfo?.smallPic;
    if (smallPic) {
        return {uri: smallPic}
    }
    return defaultImages.livingBg;
  });

  /**
   * 播放器状态
   */
  const [status, setStatus]: [number | undefined, any] = React.useState();

  /**
   * 加载推流的条件
   */
  const showPusher = !!(isPermissionGranted && pushUrl && !props.resume);

  const showLoading = status !== 2 && !props.resume;

  console.log(isPermissionGranted, 'b01_isPermissionGranted');
  console.log(pusherConfig, 'b01_pusherConfig');
  console.log(pushUrl, 'b01_pushUrl');
  console.log(showPusher, 'b01_showPusher');
  console.log(props.resume, 'b01_props.resume');

  const onStateChange = (v: any) => {
    setStatus(v);
    props.onStateChange && props.onStateChange(v);
    console.log(v, 'onStateChange');
  };

  const onStreamInfoChange = (v: any) => {
    console.log(v, 'onStreamInfoChange');
  };

  return (
    <View ref={ref} style={StyleSheet.flatten([styles.wrapper, props.style])}>
      {showPusher ? (
        <Streaming
          {...pusherConfig}
          onStateChange={onStateChange}
          onStreamInfoChange={onStreamInfoChange}
          // onSwitchCameraResult={onSwitchCameraResult}
        />
      ) : null}
      {/* {showLoading ? (
        <Image
            source={cover}
            resizeMode="cover"
            style={styles.imgBg}
        />
      ) : null} */}
      {showLoading ? (
        <PrimaryText color="white" style={styles.loading}>
          连接中
        </PrimaryText>
      ) : null}
      {props.resume ? (
        <PrimaryText color="white" style={styles.loading}>
          恢复中
        </PrimaryText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#333',
  },
  scrollerWrapper: {},
  contentWrapper: {
    justifyContent: 'flex-end',
  },
  loading: {
    position: 'absolute',
    top: vh(50) - 20,
    left: vw(50) - 20,
  },
  imgBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

export default LivePusher;
