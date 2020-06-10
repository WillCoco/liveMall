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
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
// import {Streaming} from 'pili-streaming-react-native';
// import {NodePlayerView, NodeCameraView} from 'react-native-nodemediaclient';
import {PrimaryText, SmallText} from 'react-native-normalization-text';
import {vw, vh} from '../../utils/metric';
import { isAndroid } from '../../constants/DeviceInfo';
// import {updateStarted} from '../../actions/live';
import usePermissions from '../../hooks/usePermissions';
import defaultImages from '../../assets/default-image';
import images from '../../assets/images';
import {consts, Streaming} from 'pili-streaming-react-native';
import { Colors } from '../../constants/Theme';
import { pad, radio } from '../../constants/Layout';
import { updateStarted } from '../../actions/live';
// import useNetInfo from '../../hooks/useNetInfo';
import {useNetInfo} from "@react-native-community/netinfo";

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

const RESUME_INTERVAL = 20000;

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

  const netInfo = useNetInfo();

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
  const showPusher = !!(isPermissionGranted && pushUrl);

  const showLoading = (status !== 2 && status !== 4)/*  || videoFps === VideoFps.STOPED */;

  const palying = React.useRef(status === 2 && (videoFps === VideoFps.NORMAL || videoFps === VideoFps.LOW));
  React.useEffect(() => {
    palying.current = status === 2 && (videoFps === VideoFps.NORMAL || videoFps === VideoFps.LOW);
  }, [status, videoFps])


  // 中断提示
  const showStoped = status === 4 && !!videoFps;

  // 低传输率提示
  const showLowFPS = VideoFps.LOW === videoFps && !showStoped;

  // 重试定时
  const resumeTimer: any = React.useRef();

  /**
   * 网络从
   */
  const resumeTime = React.useCallback(() => {
    // console.log(resumeTimer.current, 'resume_TimeresumeTimeresumeTimeresumeTime');

    // 如果已经有定时器了, 不继续生成
    if (resumeTimer.current) {
      if (palying.current) {
        clearInterval(resumeTimer.current);
        resumeTimer.current = null;
      }
      return;
    }

    // 没有定时器
    // 先重连
    dispatch(updateStarted(false));
    setTimeout(() => {
      dispatch(updateStarted(true));
    }, 10)

    // 生成定时器
    resumeTimer.current = setInterval(() => {
      console.log(palying.current, 'palyingpalyingpalying')
      // 已经连上, 直接返回
      if (palying.current) {
        clearInterval(resumeTimer.current);
        return;
      };

      // 开始重连
      dispatch(updateStarted(false));
      setTimeout(() => {
        dispatch(updateStarted(true));
      }, 10)
    }, RESUME_INTERVAL);
  }, []);

  // const {netInfo, getNetInfo} = useNetInfo(resumeTime);

  
  // console.log(showStoped, 'showLowFPSshowLowFPSshowLowFPS')
  // console.log(isPermissionGranted, 'b01_isPermissionGranted');
  // console.log(pusherConfig, 'b01_pusherConfig');
  // console.log(pushUrl, 'b01_pushUrl');
  // console.log(showPusher, 'b01_showPusher');
  // console.log(props.resume, 'b01_props.resume');
  // console.log(status, 'b01_status');

  /**
   * 清除定时器
   */
  React.useEffect(() => {
    return () => {
      if (resumeTimer.current) {
        clearTimeout(resumeTimer.current);
      }
    }
  }, []);

  const onStateChange = (v: any) => {
    setStatus(v);
    props.onStateChange && props.onStateChange(v);

    console.log(v, videoFps, !resumeTimer.current, 'onStateChange')

    // 断流重连
    if ((v === 4 || !!videoFps) && !resumeTimer.current) {
      resumeTime();
    }
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
    if (videoStatus !== videoFps) {
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
          <ActivityIndicator color="white" style={{paddingVertical: 6}} />
          <SmallText color="white">连接中</SmallText>
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
        <SmallText color="white">您的视频传输质量较差</SmallText>
        <SmallText color="white">请检查网络</SmallText>
      </View>
    )
  }, [])
  
  /**
   * 中断
   */
  const LIVESTOPED = React.useMemo(() => {
    return (
      <View style={styles.textWrapper}>
        <SmallText color="white">您的直播推流已中断</SmallText>
        <SmallText color="white">请确保网络通畅</SmallText>
      </View>
    )
  }, [])

  /**
   * 最终的提示
   * 避免显示两个
  */
  let finallyShowTip;
  let FinallyShowComponent;
  if (showStoped) {
    finallyShowTip = showStoped;
    FinallyShowComponent = LIVESTOPED;
  } else if (showLoading) {
    finallyShowTip = showLoading;
    FinallyShowComponent = Loading;
  } else if (showLowFPS) {
    finallyShowTip = showLowFPS;
    FinallyShowComponent = LOWFPS;
  };

  return (
    <View ref={ref} style={StyleSheet.flatten([styles.wrapper, props.style])}>
      {showPusher ? (
        <Streaming
          ref={(streaming: any) => {
            if (ref) {
              ref(streaming)
            }
            pusher.current = streaming;
          }}
          {...pusherConfig}
          onStateChange={onStateChange}
          onStreamInfoChange={onStreamInfoChange}
          // onSwitchCameraResult={onSwitchCameraResult}
        />
      ) : null}
      <View style={styles.loadingWrapper}>
        {finallyShowTip ? FinallyShowComponent : null}
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
