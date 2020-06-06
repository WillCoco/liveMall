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
import * as ImagePicker from 'expo-image-picker';
import pickCameraRoll from '../../utils/pickCameraRoll';
import Iconvideo from '../../components/Iconfont/Iconvideo';
import {Colors} from '../../constants/Theme';
import { radio, pad } from '../../constants/Layout';
import Iconclosebg from '../../components/Iconfont/Iconclosebg';

interface VideoPickerBoxProps {
  style?: StyleProp<any>,
  imgStyle?: StyleProp<any>,
  placeholderText?: string,
  placeholderIcon?: any,
  onPicked: (info?: any) => undefined,
}

const VideoPickerBox = React.forwardRef((props: VideoPickerBoxProps, ref: any) =>  {
  /**
   * 选择
   */
  const [vedioUri, setVedioUri]: Array<any> = React.useState();

  /**
   * 
   */
  const getVideoInfo = (video: any) => {
    const {uri, duration} = video || {};
    const nameArr = uri.split('/');
    const name = nameArr[nameArr.length - 1];
    const typeArr = name.split('.');
    const type = `video/${typeArr[typeArr.length - 1]}`;

    return {
      uri,
      name,
      type,
      duration,
    }
  }

  /**
   * 选择视频
   */
  const pick = async () => {
    const video = await pickCameraRoll({mediaTypes: ImagePicker.MediaTypeOptions.Videos});
    console.log(video, 'vvvvvvvv')
    if (video) {
      const info = getVideoInfo(video);
      setVedioUri(video.uri)
      props.onPicked(info);
    }
  };

  /**
   * 取消选择
   */
  const cancel = async () => {
    setVedioUri()
    props.onPicked();
  };

  return (
    <TouchableOpacity style={StyleSheet.flatten([styles.style, props.style])} onPress={pick}>
      {
        vedioUri ? (
          <Video
            source={{uri: vedioUri}}   // Can be a URL or a local file.
            paused
            ref={ref}                                        // Store reference
            // onBuffer={this.onBuffer}                // Callback when remote video is buffering
            // onError={this.videoError}               // Callback when video cannot be loaded
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
        vedioUri ?
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