/**
 * 图片选择组件
 */
import * as React from 'react';
import {
  View,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SmallText} from 'react-native-normalization-text';
import Video from 'react-native-video';
// import * as ImagePicker from 'expo-image-picker';
// import * as ImagePicker from 'expo-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Iconvideo from '../../components/Iconfont/Iconvideo';
import {Colors} from '../../constants/Theme';
import { radio, pad } from '../../constants/Layout';
import Iconclosebg from '../../components/Iconfont/Iconclosebg';
import { Toast } from '../Toast';
import { isAndroid } from '../../constants/DeviceInfo';

interface VideoPickerBoxProps {
  style?: StyleProp<any>,
  imgStyle?: StyleProp<any>,
  placeholderText?: string,
  placeholderIcon?: any,
  onPicked: (info?: any) => undefined,
  durationLimit: number,
}

const VideoPickerBox = React.forwardRef((props: VideoPickerBoxProps, ref: any) =>  {
  /**
   * 选择
   */
  const [video, setVideo]: Array<any> = React.useState();

  /**
   * 
   */
  const getVideoInfo = (video: any) => {
    let filename;
    if (isAndroid()) {
      const nameArr = video.path.split('/');
      console.log(nameArr, 'nameArr')
      filename = nameArr[nameArr.length - 1];
    } else {
      filename = video.filename
    }
    console.log(filename, 'filenameeeee')
    return {
      uri: video.path,
      name: filename,
      type: video.mime,
    }
  }

  /**
   * 选择视频
   */
  const pick = async () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      const info = getVideoInfo(video);
      if (info) {
        setVideo(info)
      }
    
      console.log(video, 'vvvvvvvv11');
    })
    .catch(err => {
      console.log(err, '选择视频失败')
    });
    const options: any = {mediaType: 'video'};
    if (props.durationLimit) {
      options.durationLimit = props.durationLimit;
    }
    // const video = await pickCamRoll(options);
    // console.log(video, 'vvvvvvvv')
    // if (video) {
    //   const info = getVideoInfo(video);
    //   setVideoUri(video.uri)
    //   props.onPicked(info);
    // }
  };

  /**
   * 取消选择
   */
  const cancel = async () => {
    setVideo()
    props.onPicked();
  };
console.log(video, 'videoUrivideoUri')

// 利用video的时长
const onLoad = (videoInfo: any) => {
  props.onPicked({
    ...video,
    duration: videoInfo.duration
  });
}

  return (
    <TouchableOpacity style={StyleSheet.flatten([styles.style, props.style])} onPress={pick}>
      {
        video?.uri ? (
          <Video
            source={{uri: video.uri}}   // Can be a URL or a local file.
            paused
            ref={ref}                                        // Store reference
            // onBuffer={this.onBuffer}                // Callback when remote video is buffering
            // onError={this.videoError}               // Callback when video cannot be loaded
            onLoad={onLoad}
            style={styles.img}
          />
        ) : (
          <>
            {props.placeholderIcon || <Iconvideo size={24} style={styles.icon} />}
            <SmallText style={styles.placeholderText}>{props.placeholderText}</SmallText>
          </>
        )
      }
      {
        video?.uri ?
        <TouchableOpacity style={styles.close} onPress={cancel}>
          <Iconclosebg size={24} />
        </TouchableOpacity> : null
      }
    </TouchableOpacity>
  )
});

VideoPickerBox.defaultProps = {
  placeholderText: '预告视频'
};

const styles = StyleSheet.create({
  style: {
    height: 194,
    backgroundColor: Colors.bgColor,
    borderRadius: radio,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: pad,
  },
  icon: {
    marginBottom: 20
  },
  img: {
    height: '100%',
    width: '100%',
  },
  placeholderText: {
    color: Colors.lightGrey
  },
  close: {
    position: 'absolute',
    padding: 5,
    top: -16,
    right: -12,
  }
});

export default VideoPickerBox;