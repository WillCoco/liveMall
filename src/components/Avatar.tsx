/**
 * 头像
*/
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  StyleProp,
  View,
} from "react-native";
import images from "../assets/images";

interface AvatarProps {
  source?: any,
  defaultSource?: any,
  size?: number,
  imgStyle?: StyleProp<any>,
  style?: StyleProp<any>,
}

const Avatar = (props: AvatarProps) => {
  const sizeStyle = props.size && {
    width: props.size,
    height: props.size,
    borderRadius: props.size / 2
  }

  return (
    <View
      style={StyleSheet.flatten([
        styles.style,
        props.style
      ])}
    >
      <Image
        source={(props.source && props.source !== '0') && (typeof props.source === 'string' ? {uri: props.source} : props.source) || props.defaultSource}
        style={StyleSheet.flatten([
          styles.img,
          sizeStyle,
          props.imgStyle
        ])}
        resizeMode="cover"
      />
    </View>
  )
};

Avatar.defaultProps = {
  defaultSource: images.userAvatar
}

const styles = StyleSheet.create({
  style: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 38,
    height: 38,
    borderRadius: 19
  },
})

export default Avatar;