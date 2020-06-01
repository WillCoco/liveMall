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
import { RtmpView } from 'react-native-rtmpview';
import {PrimaryText} from 'react-native-normalization-text'
import {vw, vh} from '../../utils/metric';

interface LiveWindowProps {
  inputUrl: string,
  style?: StyleProp<any>,
  onStatus?: (status: number | undefined) => any,
  cover: any
}

enum PlayStatus {
  Stopped = 'Stopped',
  Playing = 'Playing',
  Buffering = 'Buffering',
  Paused = 'Paused',
  Error = 'Error',
  Discontinuity = 'Discontinuity',
  SeekingForward = 'SeekingForward',
  SeekingBackward = 'SeekingBackward',
}

const LiveWindow = React.forwardRef((props: LiveWindowProps, ref: any) : any =>  {
  /**
   * 播放器状态
   */
  const [status, setStatus]: [number | string | undefined, any] = React.useState()
  const onStatus = (status: number) => {
    setStatus(status);
    props.onStatus && props.onStatus(status);
  }

  /**
   * 播放器实例
   */
  const player: {current: any} = React.useRef();
  console.log(status, 'status');

  React.useEffect(() => {
    player.current.initialize();
  }, [])

  React.useEffect(() => {
    if (player.current) {
      player.current.play();
    }

    return () => {
      try {
        player.current.stop();
      } catch(err) {
        console.log(err, 'err')
      }
    }
  }, [props.inputUrl]);

  // 播放器状态
  const onPlaybackState = (e: any, data: any) => {
    console.log('拉流组件-状态更改:', e.nativeEvent?.state)
    const state = e.nativeEvent?.state;
    // 停止
    if (state === PlayStatus.Stopped) {
      setStatus(PlayStatus.Stopped)
    } else if (state === PlayStatus.Playing) {
      setStatus(PlayStatus.Playing)
    }
  }

  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
        <RtmpView
          style={{flex: 1, height: '100%', width: '100%', backgroundColor: '#333', borderWidth: 10, borderColor: 'red'}}
          shouldMute={true}
          ref={(r: any) => {
            if (ref) {
              ref(r);
            }
            player.current = r;
          }}
          url={props.inputUrl}
          // scaleMode="ScaleAspectFill" // 'ScaleToFill', 'ScaleAspectFit', 'ScaleAspectFill'
          // bufferTime={300}
          // maxBufferTime={1000}
          // autoplay={true}
          // renderType="SURFACEVIEW" //'SURFACEVIEW', 'TEXTUREVIEW'
          // onStatus={onStatus}
          onPlaybackState={onPlaybackState}
          onFirstVideoFrameRendered={(data) => {
            console.log(data.nativeEvent, 'dddddddddd')
          }}
          onLoadState={(data) => {
            console.log(data.nativeEvent, 'dddddddddd111')
          }}
          onBitrateRecalculated={(data) => {
            console.log(data.nativeEvent, 'dddddddddd2222')
          }}
        />
        {
          status !== PlayStatus.Playing ? (
            <View style={styles.loadingWrapper}>
              <Image
                source={props.cover}
                resizeMode="cover"
                style={styles.imgBg}
              />
              <PrimaryText color="white" style={styles.loading}>连接中</PrimaryText>
            </View>
          ) : null
        }
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'red'
  },
  loadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
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
})

export default LiveWindow;