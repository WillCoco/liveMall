import React, { useState } from 'react'
import {
  View,
  Text,
  Share,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import pxToDp from '../../../utils/px2dp'
import { AntDesign } from '@expo/vector-icons'
import { Colors } from '../../../constants/Theme'
import * as WeChat from 'react-native-wechat-lib'
import { apiCreatePoster, apiGetUserData } from '../../../service/api'
import { setUserInfo } from '../../../actions/user'
import { Portal, Toast as AntToast } from '@ant-design/react-native'
import { wxUserName } from '../../../service/api'

interface Props {
  dispatch: any;
  userId: string;
  goodsInfo: any;
  userData: any;
  inviteCode: string;
  hideShareBar(): void;
  setPosterPath(img: string, type: number): any;
}

function ShareBar(props: Props) {
  const { goodsInfo, userId, inviteCode } = props

  const { goods_id: goodsId } = goodsInfo

  /**
   * 立即分享
   */
  const share = async () => {
    let userInfo: any = {} = props.userData.userInfo || {}

    if (!userId) {
      userInfo = await apiGetUserData()
      props.dispatch(setUserInfo(userInfo))
    }

    const wxIsInstalled = await WeChat.isWXAppInstalled()

    if (wxIsInstalled) {
      // 测试 gh_fc399d40a762

      WeChat.shareMiniProgram({
        scene: 0,
        userName: wxUserName,
        title: goodsInfo.goods_name,
        webpageUrl: 'https://www.quanpinlive.com',
        thumbImageUrl: goodsInfo.goods_images_list[0].image_url,
        path: `pages/goods-info/index?invicode=${inviteCode}&id={goodsId}&shareUserId=${userId}`
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })

      // WeChat.shareText({
      //   text: `邀请您加入云闪播，主播团队带货，正品大牌折上折！
      //     购物更划算！
      //     --------------
      //     下载链接：www.quanpinlive.com
      //     --------------
      //     注册填写邀请口令：${userInfo.inviteCode}`,
      //   scene: 0
      // })
    } else {
      try {
        const result = await Share.share({
          message: `邀请您加入云闪播，主播团队带货，正品大牌折上折！
            购物更划算！
            --------------
            下载链接：www.quanpinlive.com
            --------------
            注册填写邀请口令：${userInfo.inviteCode}`
        });

        if (result.action === Share.sharedAction) {
          console.log(result)
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
            props.hideShareBar()
          }
        } else if (result.action === Share.dismissedAction) {  // iOS Only
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    }
  }

  /**
   * 生成空间海报
   */
  const createPoster = async (shareType: number) => {
    let userInfo: any = {}
    let loading = AntToast.loading('正在生成海报')

    if (!userId) {
      userInfo = await apiGetUserData()
      props.dispatch(setUserInfo(userInfo))
    }

    const params = await {
      goodsId,
      userId: userId || userInfo.userId,
      shareType
    }

    apiCreatePoster(params).then((res: any) => {
      Portal.remove(loading)
      props.setPosterPath(res, shareType)
      props.hideShareBar()
    }).catch((err: any) => {
      Portal.remove(loading)
      console.log(err)
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>立即分享给好友</Text>
        <TouchableOpacity onPress={props.hideShareBar}>
          <AntDesign name="closecircleo" size={24} color={Colors.lightBlack} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.item} onPress={share}>
          <Image source={require('../../../assets/goods-image/icon_wechat.png')} style={styles.icon} />
          <Text style={styles.shareText}>立即分享</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => createPoster(2)}>
          <Image source={require('../../../assets/goods-image/icon_miniapp.png')} style={styles.icon} />
          <Text style={styles.shareText}>生成小程序码</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => createPoster(1)}>
          <Image source={require('../../../assets/goods-image/icon_card.png')} style={styles.icon} />
          <Text style={styles.shareText}>生成图文卡片</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => createPoster(3)}>
          <Image source={require('../../../assets/goods-image/icon_poster.png')} style={styles.icon} />
          <Text style={styles.shareText}>生成空间海报</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default connect(
  (state: any) => state
)(ShareBar)

const styles = StyleSheet.create({
  container: {
    height: pxToDp(350),
    padding: pxToDp(20)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pxToDp(64)
  },
  title: {
    fontSize: pxToDp(28),
    color: Colors.darkBlack
  },
  content: {
    flexDirection: 'row'
  },
  item: {
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    width: pxToDp(114),
    height: pxToDp(114),
    marginBottom: pxToDp(20)
  },
  shareText: {
    fontSize: pxToDp(22),
    color: Colors.lightBlack
  }
})