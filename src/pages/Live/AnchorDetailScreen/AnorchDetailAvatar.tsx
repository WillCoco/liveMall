/**
 * 主播详情
 */
import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  PanResponder,
  TouchableOpacity,
  StyleProp
} from 'react-native';
import {PrimaryText, SmallText} from 'react-native-normalization-text';
import Avatar from '../../../components/Avatar';
import {Colors} from '../../../constants/Theme';
import {vw} from '../../../utils/metric';

const AnorchDetailAvatar = (props: {
  isLiving: boolean,
  onPress?: () => void,
  style?: StyleProp<any>,
  source?: any
}) =>  {
  return (
    <TouchableOpacity style={StyleSheet.flatten([styles.avatarWrapper, props.style])} onPress={props.onPress}>
      <Avatar
        size={vw(17)}
        style={{
          borderWidth: 2,
          borderRadius: vw(17),
          borderColor: Colors.basicColor
        }}
        imgStyle={{
          borderWidth: 2,
          borderColor: '#fff'
        }}
        source={props.source}
      />
      {props.isLiving && <Text style={styles.livingText}>直播中</Text>}
    </TouchableOpacity>
  )
};

AnorchDetailAvatar.defaultProps = {
};

const styles = StyleSheet.create({
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  livingText: {
    color: '#fff',
    backgroundColor: Colors.basicColor,
    height: 18,
    lineHeight: 18,
    paddingHorizontal: 7,
    borderRadius: 9,
    position: 'absolute',
    bottom: -2,
    fontSize: 12
    // transform: [{translateY: vw(8)}]
  }
});

export default AnorchDetailAvatar;