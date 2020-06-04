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
import { isAndroid } from '../../constants/DeviceInfo';
// import {updateStarted} from '../../actions/live';
import usePermissions from '../../hooks/usePermissions';
import defaultImages from '../../assets/default-image';
import images from '../../assets/images';
import {consts, Streaming} from 'pili-streaming-react-native';
import { Colors } from '../../constants/Theme';
import { pad, radio } from '../../constants/Layout';

interface LivePusherProps {
  style?: StyleProp<any>,
  onStateChange?: (v: any) => any,
  setResume: (v: boolean) => any
  resume: boolean
}

enum VideoFps {
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  STOPED = 'STOPED',
}

const VIDEO_LOW_FPS_THRESHOLD = 6; // 临界

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
   * 视频传输状态
   */
  const [videoFps, setVideoFps]: [VideoFps | undefined, any] = React.useState();

  /**
   * 加载推流的条件
   */
  const showPusher = !!(isPermissionGranted && pushUrl && !props.resume);

  const showLoading = status !== 2 && status !== 4 && !props.resume;

  // 低传输率提示
  const showLowFPS = VideoFps.LOW === videoFps;
  
  // 中断提示
  const showStoped = status === 4 && !!videoFps;


  console.log(showStoped, 'showLowFPSshowLowFPSshowLowFPS')

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
    let videoStatus;
    if (v.videoFPS >= VIDEO_LOW_FPS_THRESHOLD) {
      // 视频fps正常
      videoStatus = VideoFps.NORMAL;
    } else if (v.videoFPS === 0) {
      // 视频fps为0
      videoStatus = VideoFps.STOPED;
    } else if (v.videoFPS < VIDEO_LOW_FPS_THRESHOLD) {
      // 视频fps偏低
      videoStatus = VideoFps.LOW;
    }

    console.log(v, 'vvv')
    console.log(videoStatus, 'videoStatus', status)
    if (videoStatus !== VideoFps.NORMAL) {
      setVideoFps(videoStatus);
    }
  };

  /**
   * 连接中组件
   */
  const Loading = React.useMemo(() => {
    if (isAndroid()) {
      return (
        <View style={styles.textWrapper}>
          <PrimaryText color="white">连接中</PrimaryText>
        </View>
      )
    };

    return (
      <Image
        source={images.loadingBlock}
        resizeMode="cover"
        style={styles.loadingBlock}
      />
    )
  }, [])
  
  /**
   * 低fps提示组件
   */
  const LOWFPS = React.useMemo(() => {
    return (
      <View style={styles.textWrapper}>
        <PrimaryText color="white">您的视频传输质量较差</PrimaryText>
        <PrimaryText color="white">请检查网络</PrimaryText>
      </View>
    )
  }, [])
  
  /**
   * 中断
   */
  const LIVESTOPED = React.useMemo(() => {
    return (
      <View style={styles.textWrapper}>
        <PrimaryText color="white">您的直播推流已中断</PrimaryText>
        <PrimaryText color="white">请检查网络后重新打开云闪播</PrimaryText>
      </View>
    )
  }, [])

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
      <View style={styles.loadingWrapper}>
        {showLoading ? Loading : null}
        {showLowFPS ? LOWFPS : null}
        {showStoped ? LIVESTOPED : null}
        {props.resume ? (
          <PrimaryText color="white" style={styles.loading}>
            恢复中
          </PrimaryText>
        ) : null}
      </View>
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
  loadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingBlock: {
  },
  textWrapper: {
    alignItems: 'center',
    backgroundColor: Colors.opacityDarkBg1,
    padding: pad,
    borderRadius: radio
  }
});

export default LivePusher;
