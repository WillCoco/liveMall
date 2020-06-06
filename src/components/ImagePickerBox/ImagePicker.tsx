/**
 * 图片选择组件
 */
import * as React from 'react';
import {
  View,
  Image,
  PrimaryText,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SmallText} from 'react-native-normalization-text';
import ImagePicker from 'react-native-image-crop-picker';
import pickCamRoll from '../../utils/pickCamRoll';
import Iconadd from '../../components/Iconfont/Iconadd';
import Iconclosebg from '../../components/Iconfont/Iconclosebg';
import { Colors } from '../../constants/Theme';
import { Toast } from '../Toast';

interface ImagePickerBoxProps {
  style?: StyleProp<any>,
  imgStyle?: StyleProp<any>,
  contentWrapper?: StyleProp<any>,
  placeholderText?: string,
  placeholderIcon?: any,
  onPicked: (info?: any) => any,
  canClose?: boolean,
  initImg?: any, // 初始图
}

const ImagePickerBox = (props: ImagePickerBoxProps) =>  {
  /**
   * 选择图片
   */
  const getImgInfo = (img: any) => {
    let name;
    try {
      const nameArr = img.path.split('/');
      console.log(nameArr, 'nameArr')
      name = nameArr[nameArr.length - 1];
    } catch (err) {
      console.log(err, '图片name')
    }

    return {
      uri: img.path,
      name: name,
      type: img.mime
    }
  }

  /**
   * 选择图片
   */
  const [coverUri, setCoverUri]: Array<any> = React.useState(props.initImg);
  const pickCover = async () => {
    // const r = await pickCamRoll();
    ImagePicker.openPicker({
      mediaType: "photo",
    }).then((image) => {
      console.log(image, '  ');
      if (image) {
        const info = getImgInfo(image);
        console.log(info, 'picked_img_infoooooooo');
        if (info.uri && info.name && info.type) {
          setCoverUri(info.uri);
          props.onPicked(info);
        }
        return;
      }
      Toast.show('选择失败');
    })
    .catch(r => console.log('取消选择', r));
  };

  /**
   * 取消选择图片
   */
  const cancel = async () => {
    setCoverUri()
    props.onPicked();
  };

  return (
    <TouchableOpacity style={StyleSheet.flatten([styles.style, props.style])} onPress={pickCover}>
      {/* <View style={StyleSheet.flatten([styles.contentWrapper, props.contentWrapper])}> */}
        {
          coverUri ? (
            <>
              <Image
                style={StyleSheet.flatten([styles.img, props.imgStyle])}
                source={{uri: coverUri}}
                resizeMode="cover"
              />
            </>
          ) : (
            <>
              {props.placeholderIcon || <Iconadd />}
              <SmallText style={styles.placeholderText}>{props.placeholderText}</SmallText>
            </>
          )
        }
        {
          coverUri ?
          <TouchableOpacity style={styles.close} onPress={cancel}>
            <Iconclosebg size={24} />
          </TouchableOpacity> : null
        }
      {/* </View> */}
    </TouchableOpacity>
  )
};

ImagePickerBox.defaultProps = {
  placeholderText: '选择图片',
  canClose: true
};

const styles = StyleSheet.create({
  style: {
    height: 120,
    width: 120,
    backgroundColor: Colors.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: '100%',
    width: '100%',
  },
  imgStyle: {

  },
  placeholderText: {
    color: Colors.lightGrey,
    marginTop: '8%'
  },
  close: {
    position: 'absolute',
    padding: 5,
    top: -16,
    right: -12,
  }
});

export default ImagePickerBox;