import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import CardTitle from '../../../components/CardTitle/CardTitle'
import { Colors } from '../../../constants/Theme'
import pxToDp from '../../../utils/px2dp'

export default function ToolBar() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <CardTitle title='我的工具栏' />
      <View style={styles.content}>
        <TouchableOpacity style={styles.item}>
          <Image source={require('../../../assets/mine-image/icon_share.png')} style={styles.icon} />
          <Text style={styles.text}>分享好友</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Image source={require('../../../assets/mine-image/icon_about.png')} style={styles.icon} />
          <Text style={styles.text}>云闪播APP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Image source={require('../../../assets/mine-image/icon_xieyi.png')} style={styles.icon} />
          <Text style={styles.text}>云闪播协议</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => navigation.push('AnchorTabs')}>
          <Image source={require('../../../assets/mine-image/icon_live.png')} style={styles.icon} />
          <Text style={styles.text}>去直播</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    padding: pxToDp(20),
    paddingTop: pxToDp(30),
    height: pxToDp(250)
  },
  content: {
    flexDirection: 'row',
    paddingTop: pxToDp(20)
  },
  item: {
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    width: pxToDp(80),
    height: pxToDp(80),
    marginBottom: pxToDp(10)
  },
  text: {
    fontSize: pxToDp(26),
    color: Colors.darkBlack
  }
})