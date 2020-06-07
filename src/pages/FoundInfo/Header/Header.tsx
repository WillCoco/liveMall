import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import pxToDp from '../../../utils/px2dp'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { Colors } from '../../../constants/Theme'
import { useSelector } from 'react-redux'

import * as WeChat from 'react-native-wechat-lib'
// import share from '../../../utils/share'
import { wxUserName } from '../../../service/api'
import { Toast } from '@ant-design/react-native'

interface Props {
  statusBarHeight: number
  opacity: number
  thumbImageUrl: string
  worksInfo: any
}

function Header(props: Props) {
  const navigation = useNavigation()
  const { statusBarHeight, opacity, thumbImageUrl, worksInfo } = props

  // 分享相关参数
  const userId = useSelector((state: any) => state?.userData?.userInfo?.userId);
  const inviteCode = useSelector((state: any) => state?.userData?.userInfo?.inviteCode);

  const share = async () => {
    const wxIsInstalled = await WeChat.isWXAppInstalled()

    if (wxIsInstalled) {
      WeChat.shareMiniProgram({
        scene: 0,
        userName: wxUserName,
        title: worksInfo.worksTitle,
        webpageUrl: 'https://www.quanpinlive.com',
        thumbImageUrl: thumbImageUrl,
        path: `pages/found-detail/index?invicode=${inviteCode}&id=${worksInfo.worksId}&shareUserId=${userId}`
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    } else {
      Toast.fail('请先下载安装微信')
    }
  }

  return (
    <View style={[styles.container, {
      height: statusBarHeight + pxToDp(70),
      paddingTop: statusBarHeight,
      backgroundColor: `rgba(255, 50, 27, ${opacity})`,
      width: '100%'
    }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name='ios-arrow-back' size={28} color={Colors.whiteColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={share}>
        <AntDesign name='sharealt' size={20} color={Colors.whiteColor} />
      </TouchableOpacity>
    </View>
  )
}

export default connect(
  (state: any) => state.publicData
)(Header)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})