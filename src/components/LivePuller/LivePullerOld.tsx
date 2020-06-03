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
import {PrimaryText} from 'react-native-normalization-text'
import {NodePlayerView} from 'react-native-nodemediaclient';
import {vw, vh} from '../../utils/metric';
import images from '../../assets/images';
import { isAndroid, isIOS } from '../../constants/DeviceInfo';

interface LiveWindowProps {
  inputUrl: string,
  style?: StyleProp<any>,
  onStatus?: (status: number | undefined) => any,
  cover: any
}

const LiveWindow = React.forwardRef((props: LiveWindowProps, ref: any) : any =>  {
  /**
   * 播放器状态
   * ios没有
   */
  const [status, setStatus]: [number | undefined, any] = React.useState();
  const [showLoading, setShowLoading]: any = React.useState(true);

  const onStatus = (status: number) => {
    setStatus(status);
    props.onStatus && props.onStatus(status);
    // android
    if (isAndroid()) {
      setShowLoading(!status || status < 1100);
    }
  }

  /**
   * 播放器实例
   */
  const player: {current: any} = React.useRef();
  console.log(status, 'status')

  // ios延迟
  React.useEffect(() => {
    if (!isIOS()) {
      return;
    }

    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      try {
        player.current.stop();
      } catch(err) {
        console.log(err);
      }
    }
  }, [])

  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.style])}>
        <NodePlayerView
          style={{flex: 1, height: '100%', width: '100%', backgroundColor: '#333'}}
          ref={(r: any) => {
            if (r) {
              ref(r);
            }
            player.current = r;
          }}
          inputUrl={props.inputUrl}
          scaleMode="ScaleAspectFill" // 'ScaleToFill', 'ScaleAspectFit', 'ScaleAspectFill'
          bufferTime={300}
          maxBufferTime={1000}
          autoplay={true}
          renderType="SURFACEVIEW" //'SURFACEVIEW', 'TEXTUREVIEW'
          onStatus={onStatus}
        />
        {
          showLoading ? (
            <View style={styles.loadingWrapper}>
              {
                props.cover ? (
                  <Image
                    source={props.cover}
                    resizeMode="cover"
                    style={styles.imgBg}
                  />
                ) : null
              }
              {
                isAndroid() ? (
                  <PrimaryText color="white" style={styles.loading}>连接中</PrimaryText>
                ) : (
                  <Image
                    source={images.loadingBlock}
                    resizeMode="cover"
                    style={styles.loadingBlock}
                  />
                )
              }
            </View>
          ): null
        }
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingBlock: {
    position: 'absolute',
  }
})

export default LiveWindow;