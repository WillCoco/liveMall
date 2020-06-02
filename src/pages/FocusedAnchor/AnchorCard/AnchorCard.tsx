import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MediaType } from '../../../liveTypes';
import images from '../../../assets/images';

export default function AnchorCard(props: any) {

  /**
   * 直播状态
   */

  console.log(props, 3142532153125346);

  const {item} = props

  let text;

  if (item?.liveStatus === MediaType.teaser ) {
    text = '预告'
  } else if (item?.liveStatus === MediaType.living) {
    text = '直播中'
  } else if (item?.liveStatus === MediaType.record) {
    text = '回放'
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: item?.livePic }} style={styles.anchorImg} />
        <View style={styles.anchorInfo}>
          <Text style={styles.watchCount}>{item?.viewsNum || 0}人观看</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={(item?.anchorLogo && item.anchorLogo !== '0') && { uri: item?.anchorLogo } || images.userAvatar} style={styles.avatar} />
            <Text style={styles.name}>{item?.anchorName || '主播'}</Text>
          </View>
        </View>
      </View>
      <View style={StyleSheet.flatten([styles.state, item?.liveStatus !== 2 && {backgroundColor: Colors.yellowColor}])}>
        {
          text ? (
            <TouchableOpacity onPress={props.onPress}>
              <Text style={{ fontSize: pxToDp(28), color: Colors.whiteColor }}>
                {text}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(15),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    marginBottom: pxToDp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  anchorImg: {
    width: pxToDp(150),
    height: pxToDp(150),
    borderRadius: pxToDp(10)
  },
  anchorInfo: {
    marginLeft: pxToDp(24),
    paddingTop: pxToDp(15),
    paddingBottom: pxToDp(10),
    justifyContent: 'space-between'
  },
  avatar: {
    height: pxToDp(54),
    width: pxToDp(54),
    borderRadius: pxToDp(27),
  },
  watchCount: {
    fontSize: pxToDp(34),
    color: Colors.darkBlack,
    fontWeight: '500'
  },
  name: {
    fontSize: pxToDp(24),
    color: Colors.darkGrey,
    marginLeft: pxToDp(20)
  },
  state: {
    width: pxToDp(200),
    height: pxToDp(60),
    backgroundColor: Colors.basicColor,
    borderRadius: pxToDp(30),
    justifyContent: 'center',
    alignItems: 'center'
  }
})