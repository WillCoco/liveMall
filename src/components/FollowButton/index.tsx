/**
 * 关注按钮
 */
import * as React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp
} from 'react-native';
import {SmallText, scale} from 'react-native-normalization-text';
import { Colors } from '../../constants/Theme';
import { pad } from '../../constants/Layout';

interface FollowButtonPropsType {
  isFollow: boolean,
  onPress: (isFollow: boolean) => void,
  textStyle?: StyleProp<any>,
  followWrapperStyle?: StyleProp<any>,
  unFollowWrapperStyle?: StyleProp<any>,
  style?: StyleProp<any>,
  size?: any
}

const FollowButton = (props: FollowButtonPropsType) =>  {
  const editFollow = () => {
    props.onPress(!props.isFollow)
  }

  const wrapperStyle = props.isFollow ?
    (props.followWrapperStyle || styles.followWrapper) :
    (props.unFollowWrapperStyle || styles.unFollowWrapper);

  return (
    <TouchableOpacity
      style={StyleSheet.flatten([
        wrapperStyle,
        {
          height: props.size?.height,
          width: props.size?.width ? props.size?.width : 'auto',
          borderRadius: (props?.size?.height || 0) / 2,
          backgroundColor: props.isFollow ? '#fff' : Colors.basicColor
        },
        props.style
      ])}
      onPress={editFollow}
    >
        {
          props.isFollow ?
            <SmallText style={StyleSheet.flatten([styles.followText, {color: Colors.basicColor}, props.textStyle])}>取消关注</SmallText> :
            <SmallText style={StyleSheet.flatten([styles.followText, {color: '#fff'}, props.textStyle])}>关注</SmallText>
        }
    </TouchableOpacity>
  )
};

FollowButton.defaultProps = {
  size: {
    height: 28
  }
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
  },
  followWrapper: {
    backgroundColor: Colors.basicColor,
    paddingHorizontal: pad,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unFollowWrapper: {
    backgroundColor: Colors.basicColor,
    paddingHorizontal: pad,
    justifyContent: 'center',
    alignItems: 'center'
  },
  followText: {
    color: '#fff',
    textAlign: 'center'
  }
});

export default FollowButton;