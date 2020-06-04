/**
 * 拉流组件
 */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  Image
} from 'react-native';
import Video from 'react-native-video';
import {PrimaryText} from 'react-native-normalization-text'
import {vw, vh} from '../../utils/metric';
import images from '../../assets/images';
import { Toast } from '../Toast';
import { isAndroid } from '../../constants/DeviceInfo';
import { Colors } from '../../constants/Theme';
import { pad, radio } from '../../constants/Layout';

interface LiveWindowProps {
  inputUrl: string,
  style?: StyleProp<any>,
  onStatus?: (status: number | undefined) => any,
  cover: any
}

enum PlayStatus {
  Playing = 'Playing',
  Error = 'Error',
}


const LiveWindow = React.forwardRef((props: LiveWindowProps, ref: any) : any =>  {
  /**
   * 播放器状态
   */
  // 状态
  const [status, setStatus]: [PlayStatus | undefined, any] = React.useState();
  
  const [isBuffering, setIsBuffering]: [PlayStatus | undefined, any] = React.useState();

  /**
   * 播放器实例
   */
  const player: {current: any} = React.useRef();
  console.log(status, 'status');

  React.useEffect(() => {
    return () => {
      try {
        player.current.sttop();
      } catch (err) {}
    }
  }, [])

  /**
   * 开始
  */
  const onLoadStart = () => {

  }

  /**
   * 错误
  */
  const onVideoError = () => {
    // setIsReady(false);
    console.log('onVideoError')
    setStatus(PlayStatus.Error);
  }

  /**
   * 缓冲中
  */
  const onBuffer = (data: any) => {
    console.log('onBuffer')
    setIsBuffering(data?.isBuffering);
  }

  /**
   * 准备好展示
  */
  const onReadyForDisplay = () => {
    setStatus(PlayStatus.Playing);
  }

  // 视频源
  const source = props.inputUrl ? {uri: props.inputUrl} : null;

  // 显示背景图
  const showBg = !source && status !== PlayStatus.Playing;
  
  // 显示错误
  const showError = status === PlayStatus.Error;

  // 显示加载中
  const showLoading = 
    !showError && 
    (!source || status !== PlayStatus.Playing);

  const Loading = React.useMemo(() => {
    if (isAndroid()) {
      return (
        <View style={styles.textWrapper}>
          <PrimaryText color="white">连接中</PrimaryText>
        </View>
      );
    };

    return (
      <Image
        source={images.loadingBlock}
        resizeMode="cover"
        style={styles.loadingBlock}
      />
    )
  }, [])

  const ERROR = React.useMemo(() => {
    return (
      <View style={styles.textWrapper}>
        <PrimaryText color="white">连接失败</PrimaryText>
        <PrimaryText color="white">请稍后再试</PrimaryText>
      </View>
    );
  }, [])

  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
      {
        source ? (
          <Video
            ref={(video: any) => {
              if (ref) {
                ref(video);
              }
              player.current = video;
            }}
            resizeMode="cover"
            source={source}
            onLoadStart={onLoadStart}
            onReadyForDisplay={onReadyForDisplay}
            onError={onVideoError} 
            onBuffer={onBuffer}
            // onProgress={v => console.log(v, 'onProgress')}
            // onSeek={v => console.log(v, 'onSeek')}
            style={styles.video}
          />
        ) : null
      }
      <View style={styles.loadingWrapper}>
        {
          showBg ? (
            <Image
              source={props.cover}
              resizeMode="cover"
              style={styles.imgBg}
            />
          ) : null
        }
        {showLoading ? Loading : null}
        {showError ? ERROR : null}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  video: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
  scrollerWrapper: {
  },
  contentWrapper: {
    justifyContent: 'flex-end',
  },
  loading: {
    position: 'absolute',
    top: vh(50) - 20,
    left: vw(50) - 20,
  },
  imgBg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  textWrapper: {
    alignItems: 'center',
    backgroundColor: Colors.opacityDarkBg1,
    padding: pad,
    borderRadius: radio,
  }
})

export default LiveWindow;